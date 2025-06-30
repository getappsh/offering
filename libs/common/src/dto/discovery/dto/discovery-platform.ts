import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from "class-validator"
import { DiscoveryMessageV2Dto } from "./discovery-message.dto"

export class PlatformDiscoverDto {

  @ApiProperty({
    description: 'Name of the platform or system being discovered'
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim().replace(/\s+/g, "-"))
  name: string

  @ApiProperty({
    required: false,
    type: () => [DiscoveryMessageV2Dto],
    description: 'Array of devices discovered within this platform. Each device contains detailed discovery information of type "DiscoveryMessageV2Dto".'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiscoveryMessageV2Dto)
  devices?: DiscoveryMessageV2Dto[]
}
