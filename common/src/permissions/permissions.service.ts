import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from './types/jwt-payload.interface';
import {
  PermissionsConfig,
  DEFAULT_PERMISSIONS_CONFIG,
} from './types/permissions-config.interface';
import { ApiRole } from './constants/roles.enum';

/**
 * Service for validating user permissions based on JWT roles
 */
@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  private readonly config: Required<PermissionsConfig>;

  constructor() {
    this.config = DEFAULT_PERMISSIONS_CONFIG;
  }

  /**
   * Check if permissions validation is enabled
   * Enabled if either:
   * 1. Environment variable is set to 'true'
   * 2. User has the stamp role in their API roles
   */
  isPermissionsEnabled(user: JwtPayload): boolean {
    // Check environment variable
    const envValue = process.env[this.config.enableEnvVar];
    if (envValue === 'true' || envValue === '1') {
      this.logger.debug(
        `Permissions enabled via environment variable: ${this.config.enableEnvVar}`,
      );
      return true;
    }

    // Check for stamp role
    const apiRoles = this.extractApiRoles(user);
    const hasStampRole = apiRoles.includes(this.config.stampRole);

    if (hasStampRole) {
      this.logger.debug(
        `Permissions enabled via stamp role: ${this.config.stampRole}`,
      );
    }

    return hasStampRole;
  }

  /**
   * Extract API roles from the JWT payload
   */
  extractApiRoles(user: JwtPayload): string[] {
    if (!user.resource_access) {
      this.logger.warn('No resource_access found in JWT payload');
      return [];
    }

    const resourceRoles = user.resource_access[this.config.resourceName];
    if (!resourceRoles) {
      this.logger.warn(
        `No roles found for resource: ${this.config.resourceName}`,
      );
      return [];
    }

    return resourceRoles.roles || [];
  }

  /**
   * Check if user has a specific role
   */
  hasRole(user: JwtPayload, role: string): boolean {
    const apiRoles = this.extractApiRoles(user);
    return apiRoles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: JwtPayload, roles: string[]): boolean {
    const apiRoles = this.extractApiRoles(user);
    return roles.some((role) => apiRoles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(user: JwtPayload, roles: string[]): boolean {
    const apiRoles = this.extractApiRoles(user);
    return roles.every((role) => apiRoles.includes(role));
  }

  /**
   * Validate that user has required roles
   * @param user - The JWT payload from the request
   * @param requiredRoles - Array of required roles (user needs at least one)
   * @param requireAll - If true, user must have all roles; if false, user needs at least one
   * @returns true if user has required permissions, false otherwise
   */
  validatePermissions(
    user: JwtPayload,
    requiredRoles: string[],
    requireAll: boolean = false,
  ): boolean {
    if (!user) {
      this.logger.warn('No user found in request');
      return false;
    }

    // If permissions are not enabled, allow access
    if (!this.isPermissionsEnabled(user)) {
      this.logger.debug('Permissions validation is disabled, allowing access');
      return true;
    }

    // If no specific roles required, just check if permissions are enabled
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug('No specific roles required, allowing access');
      return true;
    }

    // Check roles
    const hasPermission = requireAll
      ? this.hasAllRoles(user, requiredRoles)
      : this.hasAnyRole(user, requiredRoles);

    if (hasPermission) {
      this.logger.debug(
        `User has required permissions: ${requiredRoles.join(', ')}`,
      );
    } else {
      const userRoles = this.extractApiRoles(user);
      this.logger.warn(
        `User lacks required permissions. Required: ${requiredRoles.join(', ')}, User has: ${userRoles.join(', ')}`,
      );
    }

    return hasPermission;
  }

  /**
   * Get all roles for a user
   */
  getUserRoles(user: JwtPayload): string[] {
    return this.extractApiRoles(user);
  }
}
