import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PermissionsService } from './permissions.service';
import { REQUIRED_ROLES_KEY } from './constants/metadata-keys';
import { RequirePermissionsOptions } from './constants/permissions.decorator';
import { JwtPayload } from './types/jwt-payload.interface';

/**
 * Guard to enforce role-based permissions
 * Works in conjunction with @RequirePermissions decorator
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator metadata
    const permissionsOptions = this.reflector.getAllAndOverride<
      RequirePermissionsOptions | undefined
    >(REQUIRED_ROLES_KEY, [context.getHandler(), context.getClass()]);

    // If no permissions decorator found, allow access
    if (!permissionsOptions) {
      this.logger.debug('No permissions required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let user: JwtPayload = request.user;

    // If user is not set, try to extract and validate JWT from authorization header
    if (!user) {
      const authHeader = request.headers.authorization || request.headers.Authorization;
      
      if (!authHeader) {
        this.logger.warn('No user found in request and no authorization header provided');
        throw new UnauthorizedException('Authentication required');
      }

      try {
        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')
          ? authHeader.substring(7)
          : authHeader;

        // Decode and validate the JWT
        user = this.jwtService.decode(token) as JwtPayload;
        
        if (!user) {
          this.logger.warn('Failed to decode JWT token');
          throw new UnauthorizedException('Invalid authentication token');
        }

        // Set user in request for potential use by other guards/interceptors
        request.user = user;
        this.logger.debug(`Successfully extracted user from JWT: ${user.preferred_username}`);
      } catch (error) {
        this.logger.error(`JWT validation failed: ${error.message}`);
        throw new UnauthorizedException('Invalid or expired authentication token');
      }
    }

    const { roles, requireAll = false } = permissionsOptions;

    // Validate permissions
    const hasPermission = this.permissionsService.validatePermissions(
      user,
      roles,
      requireAll,
    );

    if (!hasPermission) {
      const userRoles = this.permissionsService.getUserRoles(user);
      this.logger.warn(
        `Access denied for user ${user.preferred_username}. ` +
          `Required: ${roles.join(', ')} (requireAll: ${requireAll}), ` +
          `User has: ${userRoles.join(', ')}`,
      );

      throw new ForbiddenException(
        `Insufficient permissions. Required role${roles.length > 1 ? 's' : ''}: ${roles.join(', ')}`,
      );
    }

    this.logger.debug(
      `Access granted for user ${user.preferred_username} to ${context.getClass().name}.${context.getHandler().name}`,
    );

    return true;
  }
}
