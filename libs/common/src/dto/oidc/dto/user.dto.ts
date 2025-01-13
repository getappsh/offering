import { MemberEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEmail } from "class-validator";

export class UserDto {

  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lastName?: string;

  static fromUserDto(user: UserDto): UserDto {
    const userDto = new UserDto();
    userDto.email = user.email;
    userDto.username = user.username;
    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;
    return userDto;
  }
  
  static fromMemberE(user: MemberEntity): UserDto {
    const userDto = new UserDto();
    userDto.email = user.email;
    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;
    return userDto;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}