import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DeviceTypeEntity } from "@app/common/database/entities";

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

  toString() {
    return JSON.stringify(this);
  }
}

export class UpdateDeviceTypeDto extends PartialType(OmitType(CreateDeviceTypeDto, ['name'] as const)) {
  name: string;
}

export class DeviceTypeDto extends CreateDeviceTypeDto {
  @ApiProperty({ description: "Timestamp when the device type was created" })
  createdAt: Date;

  @ApiProperty({ description: "Timestamp when the device type was last updated" })
  updatedAt: Date;

  static fromEntity(entity: DeviceTypeEntity) {
    const dto = new DeviceTypeDto();
    dto.name = entity.name;
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
  @ApiProperty({ description: "Name of the device type" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")
  )
  @Type(() => String)
  name: string;

  toString() {
    return JSON.stringify(this);
  }
}