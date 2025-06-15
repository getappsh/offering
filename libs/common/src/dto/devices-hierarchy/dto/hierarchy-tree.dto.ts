import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator";
import { ProjectIdentifierParams } from "../../project-management";
import { DeviceTypeEntity, PlatformEntity, ProjectEntity } from "@app/common/database/entities";


export class ProjectRefDto {
  @ApiProperty({ description: "Name of the project" })
  projectName: string;

  @ApiProperty({ description: "Identifier of the project" })
  projectId: number;

  static fromProjectEntity(project: ProjectEntity) {
    const dto = new ProjectRefDto();
    dto.projectName = project.name;
    dto.projectId = project.id;
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class DeviceTypeHierarchyDto {
  @ApiProperty({ description: "Name of the device type" })
  deviceTypeName: string;

  @ApiProperty({ type: ProjectRefDto, isArray: true, required: false })
  projects?: ProjectRefDto[];

  static fromDeviceTypeEntity(deviceType: DeviceTypeEntity) {
    const dto = new DeviceTypeHierarchyDto();
    dto.deviceTypeName = deviceType.name;
    dto.projects = deviceType.projects.map(ProjectRefDto.fromProjectEntity);
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformHierarchyDto {
  @ApiProperty({description: "Name of the platform"})
  platformName: string;

  @ApiProperty({ type: DeviceTypeHierarchyDto, isArray: true, required: false })
  deviceTypes?: DeviceTypeHierarchyDto[];

  static fromPlatformEntity(platform: PlatformEntity) {
    const dto = new PlatformHierarchyDto();
    dto.platformName = platform.name;
    dto.deviceTypes = platform.deviceTypes.map(DeviceTypeHierarchyDto.fromDeviceTypeEntity);
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformDeviceTypeParams {
  @ApiProperty({ description: "Name of the platform" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")
  )
  @Type(() => String)
  platformName: string;

  @ApiProperty({ description: "Name of the device type" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")
  )
  @Type(() => String)
  deviceTypeName: string;
}

export class DeviceTypeProjectParams extends IntersectionType(
  PickType(PlatformDeviceTypeParams, ['deviceTypeName'] as const),
  ProjectIdentifierParams
) {}
