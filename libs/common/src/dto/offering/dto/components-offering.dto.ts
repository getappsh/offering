import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { DiscoveryMessageV2Dto } from "../../discovery";
import { ComponentV2Dto } from "../../upload";
import { RestrictionDto } from "../../discovery/dto/restriction.dto";


export class DeviceTypeProjectRefDto {
  @ApiProperty({ description: "ID of the device type", required: false })
  @IsOptional()
  @IsInt()
  deviceTypeId?: number;

  @ApiProperty({ description: "Name of the device type", required: false })
  @IsOptional()
  @IsString()
  deviceTypeName?: string;

  @ApiProperty({ description: "ID of the project" })
  @IsInt()
  projectId: number;

  @ApiProperty({ description: "Name of the project" })
  @IsString()
  projectName: string;

  @ApiProperty({ description: "Display name of the project", required: false })
  @IsOptional()
  @IsString()
  projectDisplayName?: string;

  @ApiProperty({ description: "Label of the project", required: false })
  @IsOptional()
  @IsString()
  projectLabel?: string;

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformDeviceTypeTreeDto {
  @ApiProperty({ description: "Platform Type ID - present when device types are under a platform type", required: false })
  @IsOptional()
  @IsInt()
  platformTypeId?: number;

  @ApiProperty({ description: "Platform Type name - present when device types are under a platform type", required: false })
  @IsOptional()
  @IsString()
  platformTypeName?: string;

  @ApiProperty({ 
    type: () => [DeviceTypeProjectRefDto], 
    description: "Device types with projects (under platform if platform fields are present, or standalone)" 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeviceTypeProjectRefDto)
  deviceTypes: DeviceTypeProjectRefDto[];

  toString() {
    return JSON.stringify(this);
  }
}


export class ReleaseOfferingDto {
  @ApiProperty({ type: () => ComponentV2Dto, description: "Release component data" })
  @ValidateNested()
  @Type(() => ComponentV2Dto)
  release: ComponentV2Dto;

  @ApiProperty({ description: "Flag indicating if this is a push action", default: false })
  @IsBoolean()
  isPush: boolean;

  @ApiProperty({ 
    type: () => [PlatformDeviceTypeTreeDto], 
    description: "Platform and device type hierarchy where this release is offered" 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformDeviceTypeTreeDto)
  hierarchyTrees: PlatformDeviceTypeTreeDto[];

  @ApiProperty({ 
    type: [String], 
    description: "Array of catalog IDs of releases that directly depend on this release",
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dependedOnBy?: string[];

  toString() {
    return JSON.stringify(this);
  }
}


export class DeviceComponentsOfferingDto {
  /**
   * @deprecated Use 'releases' field instead
   */
  @ApiProperty({ type: () => [ComponentV2Dto], deprecated: true, description: "Use 'releases' field instead" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentV2Dto)
  offer: ComponentV2Dto[]

  /**
   * @deprecated Use 'releases' field instead
   */
  @ApiProperty({ type: () => [ComponentV2Dto], deprecated: true, description: "Use 'releases' field instead" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentV2Dto)
  push: ComponentV2Dto[]

  @ApiProperty({ type: () => [ReleaseOfferingDto], description: "Components with all additional data of platform and device type hierarchy, project and actions" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReleaseOfferingDto)
  releases: ReleaseOfferingDto[]

  @ApiProperty({ 
    type: () => [RestrictionDto],
    description: 'List of applicable restrictions for the device based on device ID, device type, OS, and other metadata'
  })
  @IsArray()
  restrictions: RestrictionDto[]


  toString() {
    return JSON.stringify(this)
  }

}


export class ComponentOfferingRequestDto {
  deviceId: string;
  deviceType?: string[];
  platforms?: string[]
  /**
   * @deprecated will be removed in the future
   */
  formations?: string[]
  components?: string[]

  static fromDiscoveryMessageDto(dis: DiscoveryMessageV2Dto): ComponentOfferingRequestDto {
    const dto = new ComponentOfferingRequestDto();
    dto.deviceId = dis.id;
    dto.deviceType = dis?.deviceTypeToken?.split(",");

    dto.components = dis?.softwareData?.components?.map(comp => comp.catalogId);
    dto.formations = dis?.softwareData?.formations;
    dto.platforms = dis?.platform ? [dis.platform.token] : []
    return dto
  }
}