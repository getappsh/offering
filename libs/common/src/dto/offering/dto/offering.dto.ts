import { ApiProperty } from "@nestjs/swagger";
import { ComponentV2Dto } from "../../upload";
import { DeviceTypeHierarchyDto, PlatformHierarchyDto, ProjectRefDto } from "../../devices-hierarchy";

export class ProjectRefOfferingDto {
  @ApiProperty({ description: "Name of the project" })
  projectName: string;

  @ApiProperty({ description: "Identifier of the project" })
  projectId: number;

  @ApiProperty({ type: ComponentV2Dto, required: false })
  release?: ComponentV2Dto;

  static fromProjectRefDto(projectRef: ProjectRefDto): ProjectRefOfferingDto {
    const dto = new ProjectRefOfferingDto();
    dto.projectId = projectRef.projectId;
    dto.projectName = projectRef.projectName;
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class DeviceTypeOfferingDto {
  @ApiProperty({ description: "ID of the device type" })
  deviceTypeId: number;
  
  @ApiProperty({ description: "Name of the device type" })
  deviceTypeName: string;

  @ApiProperty({ type: ProjectRefOfferingDto, isArray: true, required: false })
  projects?: ProjectRefOfferingDto[];

  static fromDeviceTypeHierarchyDto(deviceType: DeviceTypeHierarchyDto): DeviceTypeOfferingDto {
    const dto = new DeviceTypeOfferingDto();
    dto.deviceTypeId = deviceType.deviceTypeId;
    dto.deviceTypeName = deviceType.deviceTypeName;
    dto.projects = deviceType.projects?.map(ProjectRefOfferingDto.fromProjectRefDto);
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformOfferingDto {

  @ApiProperty({ description: "ID of the platform" })
  platformId: number;
  
  @ApiProperty({description: "Name of the platform"})
  platformName: string;

  @ApiProperty({ type: DeviceTypeOfferingDto, isArray: true, required: false })
  deviceTypes?: DeviceTypeOfferingDto[];

  static fromPlatformHierarchyDto(platform: PlatformHierarchyDto): PlatformOfferingDto {
    const dto = new PlatformOfferingDto();
    dto.platformId = platform.platformId;
    dto.platformName = platform.platformName;
    dto.deviceTypes = platform.deviceTypes?.map(DeviceTypeOfferingDto.fromDeviceTypeHierarchyDto);
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}
