import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OidcRolesService } from './oidc-roles.service';

/**
 * Module for managing OIDC roles
 * 
 * Automatically syncs roles on application startup if KEYCLOAK_AUTO_SYNC_ROLES is true (default)
 * 
 * Required environment variables:
 * - KEYCLOAK_URL: Keycloak server URL (default: http://localhost:8080)
 * - KEYCLOAK_REALM: Keycloak realm name (default: getapp)
 * - KEYCLOAK_CLIENT_ID: Client ID (default: api)
 * - KEYCLOAK_ADMIN_USER: Admin username (default: admin)
 * - KEYCLOAK_ADMIN_PASSWORD: Admin password (required)
 * - KEYCLOAK_AUTO_SYNC_ROLES: Enable auto-sync on startup (default: true)
 * 
 * Usage:
 * Import this module in your application module to enable automatic role synchronization.
 * The service can also be injected to manually manage roles if needed.
 */
@Module({
  imports: [ConfigModule],
  providers: [OidcRolesService],
  exports: [OidcRolesService],
})
export class OidcRolesModule {}
