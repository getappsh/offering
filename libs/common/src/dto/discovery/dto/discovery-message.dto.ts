import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Validate, ValidateNested } from "class-validator"
import { Type } from "class-transformer";
import { GeneralDiscoveryDto } from "./discovery-general.dto";
import { DiscoverySoftwareDto, DiscoverySoftwareV2Dto } from "./discovery-software.dto";
import { DiscoveryType } from "@app/common/database/entities";
import { DiscoveryMapDto } from "./discovery-map.dto";
import { PlatformDiscoverDto } from "./discovery-platform";
import { EitherIdPresentConstraint } from "@app/common/validators/id-presentation";

export class DiscoveryMessageDto {

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeneralDiscoveryDto)
  general: GeneralDiscoveryDto;

  @ApiProperty({ enum: DiscoveryType })
  @IsNotEmpty()
  @IsEnum(DiscoveryType)
  discoveryType: DiscoveryType;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => DiscoverySoftwareDto)
  softwareData: DiscoverySoftwareDto;

  @ApiProperty({ required: false, type: DiscoveryMapDto })
  @ValidateNested()
  @Type(() => DiscoveryMapDto)
  mapData: DiscoveryMapDto;

  toString() {
    return JSON.stringify(this)
  }

}

export class DiscoveryMessageV2Dto {

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  /**
   * In the future, this field will be required
  */
  @IsOptional()
  id: string

  /**
   * Temporary validation until id will be required
   * put it here to ensure the validation because this field is always not empty
   */
  @Validate(EitherIdPresentConstraint)
  @ApiProperty({
    required: false,
    description: 'Timestamp when the discovery snapshot was taken',
    type: String, // Important for Swagger to document this as a string
    example: new Date(),
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  snapshotDate: Date = new Date();

  @ApiProperty({
    required: false,
    description: 'Name or ID (as string) of the deviceType (e.g., router, switch, server, etc.), used for discovery of devices of type "device"'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceTypeToken?: string

  
  /**
   * @deprecated This field is deprecated and will be removed in the future, use deviceTypeToken
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deviceType?: string

  @ApiProperty({
    required: false,
    type: () => PlatformDiscoverDto,
    description: 'Platform-specific discovery information containing device details and associated devices, used for discovery of devices of type "platform"'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlatformDiscoverDto)
  platform?: PlatformDiscoverDto

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeneralDiscoveryDto)
  general?: GeneralDiscoveryDto;

  @ApiProperty({ enum: DiscoveryType })
  @IsNotEmpty()
  @IsEnum(DiscoveryType)
  discoveryType: DiscoveryType;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => DiscoverySoftwareV2Dto)
  softwareData: DiscoverySoftwareV2Dto;

  @ApiProperty({ required: false, type: DiscoveryMapDto })
  @ValidateNested()
  @Type(() => DiscoveryMapDto)
  mapData: DiscoveryMapDto;


  toString() {
    return JSON.stringify(this)
  }
}