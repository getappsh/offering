import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, ValidateNested } from "class-validator"
import { Type } from "class-transformer";
import { GeneralDiscoveryDto } from "./discovery-general.dto";
import { DiscoverySoftwareDto, DiscoverySoftwareV2Dto } from "./discovery-software.dto";
import { DiscoveryType } from "@app/common/database/entities";
import { DiscoveryMapDto } from "./discovery-map.dto";

export class DiscoveryMessageDto {

  @ApiProperty({required: false})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeneralDiscoveryDto)
  general: GeneralDiscoveryDto;

  @ApiProperty({enum: DiscoveryType})
  @IsNotEmpty()
  @IsEnum(DiscoveryType)
  discoveryType: DiscoveryType;

  @ApiProperty({required: false})
  @ValidateNested()
  @Type(() => DiscoverySoftwareDto)
  softwareData: DiscoverySoftwareDto;

  @ApiProperty({required: false, type: DiscoveryMapDto})
  @ValidateNested()
  @Type(() => DiscoveryMapDto)
  mapData: DiscoveryMapDto;

  toString() {
    return JSON.stringify(this)
  }
  
}


export class DiscoveryMessageV2Dto {
  @ApiProperty({required: false})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeneralDiscoveryDto)
  general: GeneralDiscoveryDto;

  @ApiProperty({enum: DiscoveryType})
  @IsNotEmpty()
  @IsEnum(DiscoveryType)
  discoveryType: DiscoveryType;

  @ApiProperty({required: false})
  @ValidateNested()
  @Type(() => DiscoverySoftwareV2Dto)
  softwareData: DiscoverySoftwareV2Dto;

  @ApiProperty({required: false, type: DiscoveryMapDto})
  @ValidateNested()
  @Type(() => DiscoveryMapDto)
  mapData: DiscoveryMapDto;
}
