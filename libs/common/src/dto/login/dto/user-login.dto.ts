import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty } from "class-validator"

export class UserLoginDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    username: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    password: string
  }