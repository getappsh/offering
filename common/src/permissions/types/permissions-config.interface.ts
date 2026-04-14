/**
 * Configuration interface for the permissions system
 */
export interface PermissionsConfig {
  /**
   * The environment variable name to check if permissions are enabled
   * Default: 'ENABLE_PERMISSIONS'
   */
  enableEnvVar?: string;

  /**
   * The stamp role that enables permissions when present in user's roles
   * Default: 'permissions-enabled'
   */
  stampRole?: string;

  /**
   * The resource name in JWT resource_access to check for roles
   * Default: 'api'
   */
  resourceName?: string;

  /**
   * Whether to throw exception or just log when permission check fails
   * Default: true (throws ForbiddenException)
   */
  throwOnForbidden?: boolean;

  /**
   * Custom error message when permission is denied
   */
  forbiddenMessage?: string;
}

/**
 * Default permissions configuration
 */
export const DEFAULT_PERMISSIONS_CONFIG: Required<PermissionsConfig> = {
  enableEnvVar: 'ENABLE_PERMISSIONS',
  stampRole: 'permissions-enabled',
  resourceName: 'api',
  throwOnForbidden: true,
  forbiddenMessage: 'Insufficient permissions to access this resource',
};
