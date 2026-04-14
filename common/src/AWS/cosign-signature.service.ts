import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tmpdir } from 'os';
import { mkdtempSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import stream from 'stream';
import * as fs from 'fs';

@Injectable()
export class CosignSignatureService {
  private readonly logger = new Logger(CosignSignatureService.name);
  private readonly privateKeyPath: string;
  private readonly publicKeyPath: string;
  private readonly password: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    try {
      this.password = this.configService.getOrThrow<string>('COSIGN_PASSWORD');
      this.privateKeyPath = this.configService.getOrThrow<string>('COSIGN_PRIVATE_KEY_PATH');
      this.publicKeyPath = this.configService.getOrThrow<string>('COSIGN_PUBLIC_KEY_PATH');
    } catch (error) {
      this.logger.error('Missing required COSIGN configuration environment variables.', error);
    }
  }

  async signFile(fileStream: stream.Readable): Promise<Buffer> {
    this.logger.debug(`Signing file`);

    const tmpSig = join(tmpdir(), `cosign-${Date.now()}.sig`);

    const env = {
      COSIGN_PASSWORD: this.password,
    };

    return new Promise<Buffer>((resolve, reject) => {
      const cosign = spawn(
        'cosign',
        [
          'sign-blob',
          '--key', this.privateKeyPath,
          '--tlog-upload=false',
          '--output-signature', tmpSig,
          '--use-signing-config=false',
          '-' // stdin payload
        ],
        { env }
      );

      cosign.on('error', reject);
      cosign.stderr.on('data', d => this.logger.warn(d.toString()));

      cosign.on('exit', code => {
        if (code !== 0) {
          return reject(new Error(`cosign exited with ${code}`));
        }

        fs.readFile(tmpSig, (err, sig) => {
          if (err) return reject(err);
          resolve(sig);
          fs.unlink(tmpSig, () => { });
        });
      });

      fileStream.pipe(cosign.stdin);
      fileStream.on('error', reject);
    });
  }

  async verifySignature(fileStream: stream.Readable, signature: string): Promise<boolean> {
    this.logger.debug(`Verifying signature for file`);

    const env = { ...process.env };
    env.COSIGN_PASSWORD = this.password;

    return new Promise<boolean>((resolve, reject) => {

      const dir = mkdtempSync(join(tmpdir(), 'cosign-'));
      const tmpFilePath = join(dir, 'sigfile.sig');
      writeFileSync(tmpFilePath, signature);
      this.logger.log(`Temporary signature file created at: ${tmpFilePath}`);

      const cosign = spawn('cosign', ['verify-blob', '-', '--key', this.publicKeyPath, '--signature', tmpFilePath, "--insecure-ignore-tlog=true"], { env });

      let verificationOutput = '';
      let verificationError = '';

      cosign.on('error', (err) => {
        this.logger.error(`Failed to spawn cosign process: ${err.message}`);
        unlinkSync(tmpFilePath);
        reject(new Error(`Cosign spawn failed: ${err.message}`));
      });

      cosign.stdout.on('data', (chunk) => {
        verificationOutput += chunk.toString();
      });

      cosign.stderr.on('data', (chunk) => {
        verificationError += chunk.toString();
        this.logger.warn(chunk.toString());
      });

      cosign.on('exit', (code) => {
        unlinkSync(tmpFilePath);
        if (code === 0) {
          this.logger.log(`Verification succeeded: ${verificationOutput}`);
          resolve(true);
        } else {
          this.logger.error(`Verification failed with code ${code}: ${verificationError}`);
          resolve(false);
        }
      });

      fileStream.pipe(cosign.stdin);
      fileStream.on('error', (err) => reject(err));
    });
  }
}