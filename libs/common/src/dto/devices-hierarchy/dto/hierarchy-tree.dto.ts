import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { ProjectIdentifierParams } from "../../project-management";
import { DeviceTypeEntity, PlatformEntity, ProjectEntity } from "@app/common/database/entities";
import { PlatformParams } from "./platform.dto";
import { DeviceTypeParams } from "./device-type.dto";


export class ProjectRefDto {
  @ApiProperty({ description: "Unique name of the project" })
  projectName: string;

  @ApiProperty({ description: "Identifier of the project" })
  projectId: number;

  @ApiProperty({ description: "Display name of the project", required: false })
  displayName?: string;

  @ApiProperty({ description: "Label of the project", required: false })
  label?: string;

  static fromProjectEntity(project: ProjectEntity) {    
    const dto = new ProjectRefDto();
    dto.projectName = project.name;
    dto.projectId = project.id;
    dto.displayName = project.projectName ?? undefined;
    dto.label = project.label?.name;
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class DeviceTypeHierarchyDto {

  @ApiProperty({ description: "ID of the device type" })
  deviceTypeId: number;

  @ApiProperty({ description: "Name of the device type" })
  deviceTypeName: string;

  @ApiProperty({ type: ProjectRefDto, isArray: true, required: false })
  projects?: ProjectRefDto[];

  static fromDeviceTypeEntity(deviceType: DeviceTypeEntity) {
    const dto = new DeviceTypeHierarchyDto();
    dto.deviceTypeId = deviceType.id;
    dto.deviceTypeName = deviceType.name;
    dto.projects = deviceType.projects.map(ProjectRefDto.fromProjectEntity);
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformHierarchyDto {
  @ApiProperty({ description: "ID of the platform" })
  platformId: number;

  @ApiProperty({description: "Name of the platform"})
  platformName: string;

  @ApiProperty({ type: DeviceTypeHierarchyDto, isArray: true, required: false })
  deviceTypes?: DeviceTypeHierarchyDto[];

  static fromPlatformEntity(platform: PlatformEntity) {
    const dto = new PlatformHierarchyDto();
    dto.platformId = platform.id;
    dto.platformName = platform.name;
    dto.deviceTypes = platform.deviceTypes.map(DeviceTypeHierarchyDto.fromDeviceTypeEntity);
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformDeviceTypeParams extends IntersectionType(
  PlatformParams,
  DeviceTypeParams
) { }

export class DeviceTypeProjectParams extends IntersectionType(
  DeviceTypeParams,
  ProjectIdentifierParams
) {}
