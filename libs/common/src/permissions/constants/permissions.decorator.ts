import { SetMetadata } from '@nestjs/common';
import { REQUIRED_ROLES_KEY } from './metadata-keys';
import { ApiRoleType } from './roles.enum';

/**
 * Options for the RequirePermissions decorator
 */
export interface RequirePermissionsOptions {
  /**
   * Array of required roles
   */
  roles: ApiRoleType[];

  /**
   * If true, user must have ALL specified roles
   * If false, user must have AT LEAST ONE of the specified roles
   * Default: false
   */
  requireAll?: boolean;
}

/**
 * Decorator to require specific permissions for an endpoint
 * 
 * @example
 * // Require any one of the roles
 * @RequirePermissions({ roles: [ApiRole.CREATE_PROJECT, ApiRole.VIEW_PROJECT] })
 * 
 * @example
 * // Require all of the roles
 * @RequirePermissions({ roles: [ApiRole.VIEW_PROJECT, ApiRole.UPDATE_PROJECT], requireAll: true })
 * 
 * @example
 * // Simple single role
 * @RequirePermissions({ roles: [ApiRole.DELETE_PROJECT] })
 */
export const RequirePermissions = (options: RequirePermissionsOptions) => {
  return SetMetadata(REQUIRED_ROLES_KEY, options);
};

/**
 * Shorthand decorator to require a single role
 * 
 * @example
 * @RequireRole(ApiRole.CREATE_PROJECT)
 */
export const RequireRole = (role: ApiRoleType) => {
  return RequirePermissions({ roles: [role] });
};

/**
 * Shorthand decorator to require any of the specified roles
 * 
 * @example
 * @RequireAnyRole([ApiRole.VIEW_PROJECT, ApiRole.MANAGE_USERS])
 */
export const RequireAnyRole = (roles: ApiRoleType[]) => {
  return RequirePermissions({ roles, requireAll: false });
};

/**
 * Shorthand decorator to require all of the specified roles
 * 
 * @example
 * @RequireAllRoles([ApiRole.VIEW_PROJECT, ApiRole.UPDATE_PROJECT])
 */
export const RequireAllRoles = (roles: ApiRoleType[]) => {
  return RequirePermissions({ roles, requireAll: true });
};
