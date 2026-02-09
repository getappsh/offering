/**
 * Structure of the JWT token payload from Keycloak
 */
export interface JwtPayload {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string | string[];
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [resource: string]: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  preferred_username: string;
  email: string;
}

/**
 * Extended request interface that includes the decoded JWT user
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
