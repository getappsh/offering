import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { DeviceTypeEntity, OS, CPUArchitecture, DiskType, NetworkType } from "@app/common/database/entities";

export class CreateDeviceTypeDto {
  @ApiProperty({ description: "Name of the device type" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")
  )
  name: string;

  @ApiProperty({ description: "Description of the device type", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Operating system of the platform", example: OS.WINDOWS, required: false, enum: OS })
  @IsOptional()
  @IsEnum(OS)
  os?: OS;

  @ApiProperty({ required: false, enum: CPUArchitecture })
  @IsOptional()
  @IsEnum(CPUArchitecture)
  cpuArchitecture?: CPUArchitecture;

  @ApiProperty({ description: 'Number of vCPUs', required: false })
  @IsOptional()
  @IsNumber()
  cpuCount?: number;

  @ApiProperty({ description: 'Memory size in MB', required: false })
  @IsOptional()
  @IsNumber()
  memoryMb?: number;

  @ApiProperty({ description: 'Disk size in GB', required: false })
  @IsOptional()
  @IsNumber()
  diskGb?: number;

  @ApiProperty({ required: false, enum: DiskType })
  @IsOptional()
  @IsEnum(DiskType)
  diskType?: DiskType;

  @ApiProperty({ required: false, enum: NetworkType })
  @IsOptional()
  @IsEnum(NetworkType)
  networkType?: NetworkType;

  @ApiProperty({ description: 'Optional image ID', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Image ID' })
  imageId?: string;

  @ApiProperty({ description: 'Optional tags or metadata', required: false, type: Object })
  @IsOptional()
  metadata?: Record<string, string>;

  toString() {
    return JSON.stringify(this);
  }
}

export class UpdateDeviceTypeDto extends PartialType(CreateDeviceTypeDto) {
  id: number;
}

export class DeviceTypeDto extends CreateDeviceTypeDto {

  @ApiProperty({ description: "ID of the device type" })
  id: number;

  @ApiProperty({ description: "Timestamp when the device type was created" })
  createdAt: Date;

  @ApiProperty({ description: "Timestamp when the device type was last updated" })
  updatedAt: Date;

  static fromEntity(entity: DeviceTypeEntity) {
    const dto = new DeviceTypeDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.os = entity.os;
    dto.cpuArchitecture = entity.cpuArchitecture;
    dto.cpuCount = entity.cpuCount;
    dto.memoryMb = entity.memoryMb;
    dto.diskGb = entity.diskGb;
    dto.diskType = entity.diskType;
    dto.networkType = entity.networkType;
    dto.imageId = entity.imageId;
    dto.metadata = entity.metadata;
    dto.description = entity.description;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class DeviceTypeParams {
  @ApiProperty({ type: Number, description: "ID of the device type" })
  @IsInt()
  @Type(() => Number)
  deviceTypeId : number;

  toString() {
    return JSON.stringify(this);
  }
}