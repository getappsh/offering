import { OS, PlatformEntity } from "@app/common/database/entities";
import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePlatformDto {

  @ApiProperty({ description: "Name of the platform" })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")
  )
  name: string;

  @ApiProperty({ description: "Description of the platform", example: "This is a sample platform.", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Operating system of the platform", example: OS.WINDOWS, required: false, enum: OS })
  @IsOptional()
  @IsEnum(OS)
  os?: OS;

  toString() {
    return JSON.stringify(this);
  }
}


export class UpdatePlatformDto extends PartialType(OmitType(CreatePlatformDto, ['name'] as const),) {
  name: string;
}

export class PlatformDto extends CreatePlatformDto {
  
  @ApiProperty({ description: "Timestamp when the platform was created" })
  createdAt: Date;

  @ApiProperty({ description: "Timestamp when the platform was last updated" })
  updatedAt: Date;


  static fromEntity(entity: PlatformEntity) {
    const dto = new PlatformDto();
    dto.name = entity.name;
    dto.description = entity.description;
    dto.os = entity.os;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class PlatformParams {
  @ApiProperty({ description: "Name of the platform" })
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