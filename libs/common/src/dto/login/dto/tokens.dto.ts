import { ApiProperty } from "@nestjs/swagger"

export class TokensDto{
  @ApiProperty({required: true})
  accessToken: string

  @ApiProperty({required: false})
  expireAt: Date

  @ApiProperty({required: true})
  refreshToken: string

  @ApiProperty({required: false})
  refreshExpireAt: Date
}