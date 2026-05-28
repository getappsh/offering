import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export type VaultSecretField = 'ssh_key' | 'https_password' | 'config_value';

/** Thrown when any Vault API call fails – lets callers distinguish Vault errors from user/auth errors. */
export class VaultOperationError extends Error {
  constructor(
    message: string,
    public readonly httpStatus?: number,
    public readonly vaultErrors?: unknown,
  ) {
    super(message);
    this.name = 'VaultOperationError';
  }
}

const VAULT_REF_PREFIX = 'vault:';

/**
 * Service for HashiCorp Vault integration.
 *
 * When VAULT_ADDR is set, secrets (SSH keys and HTTPS passwords for git sources)
 * are stored in Vault KV v2 instead of plain text in the database.
 *
 * Database fields will contain a Vault reference in the format:
 *   vault:{mountPath}/{secretName}#{field}
 * e.g.  vault:getapp-secrets/project-7-git-credentials#ssh_key
 *
 * If VAULT_ADDR is not set, the service is disabled and all values pass through unchanged,
 * maintaining full backwards compatibility.
 *
 * Authentication (in priority order):
 *   1. VAULT_TOKEN  – static token auth
 *   2. VAULT_ROLE_ID + VAULT_SECRET_ID – AppRole auth
 */
@Injectable()
export class VaultService implements OnModuleInit {
  private readonly logger = new Logger(VaultService.name);
  private vaultAddr: string;
  private readonly mountPath: string;
  private token: string | null = null;
  private readonly _enabled: boolean;
  private http: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    // Default hostname matches both Docker Compose service name and K8s service name.
    // When VAULT_ADDR is not set, falls back to localhost:8200 for running outside Docker.
    this.vaultAddr = (configService.get<string>('VAULT_ADDR') ?? 'http://vault:8200').replace(/\/$/, '');
    this.mountPath =
      configService.get<string>('VAULT_MOUNT_PATH') ?? 'getapp-secrets';

    // Vault is enabled only when auth credentials are present.
    // This means a fresh install with no env vars set runs in plain-text legacy mode.
    const hasToken = !!configService.get<string>('VAULT_TOKEN')?.trim() || !!configService.get<string>('VAULT_DEV_ROOT_TOKEN_ID')?.trim();
    const hasAppRole =
      !!configService.get<string>('VAULT_ROLE_ID')?.trim() &&
      !!configService.get<string>('VAULT_SECRET_ID')?.trim();
    this._enabled = hasToken || hasAppRole;

    if (this._enabled) {
      this.http = axios.create({ baseURL: this.vaultAddr });
    }
  }

  get isEnabled(): boolean {
    return this._enabled;
  }

  async onModuleInit(): Promise<void> {
    if (!this._enabled) {
      this.logger.log(
        'HashiCorp Vault integration is disabled (no auth credentials set). ' +
          'Credentials will be stored as plain text.',
      );
      return;
    }

    const explicitAddr = this.configService.get<string>('VAULT_ADDR')?.trim();
    // Candidate list: VAULT_ADDR (if set), then vault:8200, then localhost:8200
    const candidates = explicitAddr
      ? [explicitAddr.replace(/\/$/, '')]
      : ['http://vault:8200', 'http://localhost:8200'];

    for (const addr of candidates) {
      this.vaultAddr = addr;
      this.http = axios.create({ baseURL: addr });
      try {
        await this.authenticate();
        await this.ensureMount();
        this.logger.log(
          `HashiCorp Vault integration is active – addr: ${this.vaultAddr}, mount: ${this.mountPath}`,
        );
        return;
      } catch (error) {
        const isNetworkError = error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED';
        if (isNetworkError && addr !== candidates[candidates.length - 1]) {
          this.logger.warn(`Vault not reachable at ${addr} (${error.code}), trying next candidate…`);
          continue;
        }
        this.logger.error(
          `Failed to initialise Vault connection at ${addr}: ${error.message}` +
            (error.response ? ` | HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}` : ''),
        );
        throw error;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Store a credential field in Vault under the given secret name.
   * Any other fields already stored at that path are preserved.
   *
   * @param secretName - The Vault path segment identifying this secret
   *                     (e.g. `project-7-git-credentials`).
   * @param metadata   - Optional key/value pairs written to the KV v2 custom metadata
   *                     (e.g. `{ projectName: 'my-project' }`).
   * @returns The Vault reference string to persist in the database column.
   */
  async storeSecret(
    secretName: string,
    field: VaultSecretField,
    value: string,
    metadata?: Record<string, string>,
  ): Promise<string> {
    if (!secretName) throw new Error('secretName is required to store a secret in Vault');

    this.assertEnabled();

    // Merge with existing fields so we never lose sibling secrets
    const existing = (await this.fetchRawSecrets(secretName)) ?? {};
    existing[field] = value;

    try {
      await this.http.post(
        `/v1/${this.mountPath}/data/${secretName}`,
        { data: existing },
        { headers: this.authHeaders() },
      );
    } catch (error) {
      const status = error.response?.status;
      const body = error.response?.data;
      const detail = status ? `HTTP ${status} – ${JSON.stringify(body)}` : error.message;
      this.logger.error(`[Vault] storeSecret failed for '${secretName}', field '${field}': ${detail}`);
      throw new VaultOperationError(`Vault storeSecret failed: ${detail}`, status, body);
    }

    if (metadata && Object.keys(metadata).length > 0) {
      try {
        await this.http.post(
          `/v1/${this.mountPath}/metadata/${secretName}`,
          { custom_metadata: metadata },
          { headers: this.authHeaders() },
        );
      } catch (error) {
        // Metadata write failure is non-fatal; log a warning and continue.
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `[Vault] Could not write custom metadata for '${secretName}': ${msg}`,
        );
      }
    }

    return `${VAULT_REF_PREFIX}${this.mountPath}/${secretName}#${field}`;
  }

  /**
   * Remove a specific credential field from Vault.
   * If no fields remain, the entire secret path is deleted.
   */
  async deleteSecret(secretName: string, field: VaultSecretField): Promise<void> {
    if (!this._enabled) return;

    const existing = await this.fetchRawSecrets(secretName);
    if (!existing) return;

    delete existing[field];

    if (Object.keys(existing).length === 0) {
      // Remove the entire secret path
      await this.http
        .delete(`/v1/${this.mountPath}/metadata/${secretName}`, {
          headers: this.authHeaders(),
        })
        .catch((err) => {
          this.logger.warn(
            `Could not delete Vault metadata for '${secretName}': ${err.message}`,
          );
        });
    } else {
      await this.http.post(
        `/v1/${this.mountPath}/data/${secretName}`,
        { data: existing },
        { headers: this.authHeaders() },
      );
    }
  }

  /**
   * Resolve a DB column value.
   * - If the value is a Vault reference (starts with `vault:`), it is fetched from Vault.
   * - Otherwise the value is returned unchanged (plain text / null / undefined).
   */
  async resolveSecret(
    value: string | null | undefined,
  ): Promise<string | null | undefined> {
    if (!value || !this.isVaultRef(value)) return value;

    this.assertEnabled();

    const { mountPath, secretId, field } = this.parseVaultRef(value);

    try {
      const response = await this.http.get(`/v1/${mountPath}/data/${secretId}`, {
        headers: this.authHeaders(),
      });
      const resolved: string | undefined = response.data?.data?.data?.[field];
      if (resolved === undefined) {
        this.logger.warn(
          `Vault secret resolved but field '${field}' not found at ${mountPath}/data/${secretId}`,
        );
        return null;
      }
      return resolved;
    } catch (error) {
      this.logger.error(
        `Failed to resolve Vault secret for ref '${value}': ${error.message}`,
      );
      throw new Error(`Failed to resolve Vault secret: ${error.message}`);
    }
  }

  /**
   * Returns true when the given value is a Vault reference string.
   */
  isVaultRef(value: string | null | undefined): boolean {
    return typeof value === 'string' && value.startsWith(VAULT_REF_PREFIX);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async authenticate(): Promise<void> {
    const staticToken = this.configService.get<string>('VAULT_TOKEN')?.trim() || this.configService.get<string>('VAULT_DEV_ROOT_TOKEN_ID')?.trim();
    if (staticToken) {
      this.token = staticToken;
      this.logger.debug('Vault: using static token authentication');
      return;
    }

    const roleId = this.configService.get<string>('VAULT_ROLE_ID')?.trim();
    const secretId = this.configService.get<string>('VAULT_SECRET_ID')?.trim();
    if (roleId && secretId) {
      this.logger.debug('Vault: using AppRole authentication');
      const response = await this.http.post('/v1/auth/approle/login', {
        role_id: roleId,
        secret_id: secretId,
      });
      this.token = response.data.auth.client_token;
      return;
    }

    throw new Error(
      'No Vault authentication method configured. ' +
        'Set VAULT_TOKEN, or both VAULT_ROLE_ID and VAULT_SECRET_ID.',
    );
  }

  private async ensureMount(): Promise<void> {
    try {
      const response = await this.http.get('/v1/sys/mounts', {
        headers: this.authHeaders(),
      });

      if (!response.data[`${this.mountPath}/`]) {
        await this.http.post(
          `/v1/sys/mounts/${this.mountPath}`,
          { type: 'kv', options: { version: '2' } },
          { headers: this.authHeaders() },
        );
        this.logger.log(
          `Vault: created KV v2 secret engine at mount path '${this.mountPath}'`,
        );
      } else {
        this.logger.debug(`Vault: mount '${this.mountPath}' already exists`);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        // Policy may not grant sys/mounts access – assume the mount exists
        this.logger.warn(
          `Vault: insufficient permissions to manage mounts (403). ` +
            `Assuming mount '${this.mountPath}' is already configured.`,
        );
        return;
      }
      throw error;
    }
  }

  private async fetchRawSecrets(
    secretName: string,
  ): Promise<Record<string, string> | null> {
    try {
      const response = await this.http.get(
        `/v1/${this.mountPath}/data/${secretName}`,
        { headers: this.authHeaders() },
      );
      return (response.data?.data?.data as Record<string, string>) ?? null;
    } catch (error) {
      if (error.response?.status === 404) return null;
      const status = error.response?.status;
      const body = error.response?.data;
      const detail = status ? `HTTP ${status} – ${JSON.stringify(body)}` : error.message;
      this.logger.error(`[Vault] fetchRawSecrets failed for '${secretName}': ${detail}`);
      throw new VaultOperationError(`Vault fetchRawSecrets failed: ${detail}`, status, body);
    }
  }

  private authHeaders(): Record<string, string> {
    return { 'X-Vault-Token': this.token! };
  }

  /**
   * Parse a Vault reference string into its components.
   * Format: vault:{mountPath}/{secretId}#{field}
   */
  private parseVaultRef(ref: string): {
    mountPath: string;
    secretId: string;
    field: string;
  } {
    const withoutPrefix = ref.slice(VAULT_REF_PREFIX.length);
    const hashIdx = withoutPrefix.lastIndexOf('#');
    const field = withoutPrefix.slice(hashIdx + 1);
    const pathPart = withoutPrefix.slice(0, hashIdx);
    const lastSlash = pathPart.lastIndexOf('/');
    const mountPath = pathPart.slice(0, lastSlash);
    const secretId = pathPart.slice(lastSlash + 1);
    return { mountPath, secretId, field };
  }

  private assertEnabled(): void {
    if (!this._enabled) {
      throw new Error(
        'VaultService is not enabled. Set the VAULT_ADDR environment variable.',
      );
    }
  }
}
