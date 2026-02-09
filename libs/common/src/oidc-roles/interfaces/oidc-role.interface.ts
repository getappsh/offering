/**
 * OIDC role representation
 */
export interface OidcRole {
  id?: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

/**
 * OIDC group representation
 */
export interface OidcGroup {
  id?: string;
  name: string;
  path?: string;
  attributes?: Record<string, string[]>;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
  subGroups?: OidcGroup[];
}

/**
 * OIDC configuration for role management
 */
export interface OidcRoleConfig {
  baseUrl: string;
  realm: string;
  clientId: string;
  adminUser: string;
  adminPassword: string;
}
