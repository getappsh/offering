import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../dto/oidc/dto/user.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export interface OidcService {
  authenticate(): Promise<void>
  getUsers(params?: UserSearchDto, limit?: number): Promise<UserDto[]>
  inviteUser(params?: UserDto): Promise<void>
}

export class UserSearchDto {
  
  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  email?: string;
  
  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  firstName?: string;
  
  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  lastName?: string;
  
  @ApiProperty({required:false})
  @IsOptional()
  @IsString()
  username?: string;
  
  @IsOptional()
  @IsBoolean()
  exact?: boolean;
}