import { UserDto } from "../dto/oidc/dto/user.dto";

export interface OidcService {
  authenticate(): Promise<void>
  getUsers(params?: UserSearchDto): Promise<UserDto[]>
  inviteUser(params?: UserDto): Promise<void>
}

export interface UserSearchDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  exact?: boolean;
}