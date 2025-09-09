import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType } from "@nestjs/swagger";
import { ComponentV2Dto } from "../../upload";
import { DeviceTypeHierarchyDto, PlatformHierarchyDto, ProjectRefDto } from "../../devices-hierarchy";
import { BadRequestException } from "@nestjs/common";
import { ValidateIf, IsString, IsNotEmpty, IsInt, IsOptional, IsPositive } from "class-validator";
import { Transform, Type } from "class-transformer";

export class GetProjectsOfferingDto {
  @ApiProperty({
    description: 'The search term (matches project name or partial match)',
    required: false
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  query: string;

  
  @ApiPropertyOptional({
    description: 'The page number to fetch (default: 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of projects per page (default: 20)',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage?: number = 20;

  toString() {
    return JSON.stringify(this);
  }
}

export class ProjectRefOfferingDto {
  @ApiProperty({ description: "Name of the project" })
  projectName: string;

  @ApiProperty({ description: "Identifier of the project" })
  projectId: number;

  @ApiProperty({ required: false, description: "Display name of the project" })
  displayName?: string;

  @ApiProperty({ required: false, description: "Label of the project" })
  label?: string;

  @ApiProperty({ type: ComponentV2Dto, required: false })
  release?: ComponentV2Dto;

  static fromProjectRefDto(projectRef: ProjectRefDto): ProjectRefOfferingDto {
    const dto = new ProjectRefOfferingDto();
    dto.projectId = projectRef.projectId;
    dto.projectName = projectRef.projectName;
    dto.displayName = projectRef.displayName;
    dto.label = projectRef.label;
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


export class PlatformOfferingParams{

  @ApiProperty({type: String, description: 'Platform identifier (ID or name)'})
  @ValidateIf((o) => typeof o.platformIdentifier === 'string')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const isNum = (num) => Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
    
    if (isNum(value)) {
      return parseInt(value, 10);
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return value.toLowerCase().trim().replace(/\s+/g, "-");
    }

    throw new BadRequestException('Invalid platform identifier');
  })
  platformIdentifier: string | number
}

export class DeviceTypeOfferingParams {

  @ApiProperty({ type: String, description: 'Device type identifier (ID or name)' })
  @ValidateIf((o) => typeof o.deviceTypeIdentifier === 'string')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const isNum = (num) => Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
    
    if (isNum(value)) {
      return parseInt(value, 10);
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return value.toLowerCase().trim().replace(/\s+/g, "-");
    }

    throw new BadRequestException('Invalid device type identifier');
  })
  deviceTypeIdentifier: string | number
}


export class ProjectOfferingFilterQuery extends IntersectionType(
  PartialType(DeviceTypeOfferingParams),
  PartialType(PlatformOfferingParams)
){
  @ValidateIf(o => o.platformIdentifier !== undefined && o.platformIdentifier !== null)
  @IsNotEmpty({ message: 'deviceTypeIdentifier is required when platformIdentifier is provided' })
  deviceTypeIdentifier?: string | number | undefined;

  projectIdentifier?: string | number | undefined;
}