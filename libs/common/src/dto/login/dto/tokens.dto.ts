import { ApiProperty } from "@nestjs/swagger"

export class TokensDto{
  @ApiProperty({required: false})
  accessToken: string


  @ApiProperty({required: false})
  refreshToken: string
}