import { OfferingTreePolicyEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class UpsertOfferingTreePolicyDto {

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  platformId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @ValidateIf((dto) => dto.platformId !== undefined && dto.platformId !== null)
  deviceTypeId?: number;

  @ApiProperty()
  @IsNumber()
  projectId: number;

  @ApiProperty({ required: false, description: "Set to null to remove the policy" })
  @IsOptional()
  @IsString()
  catalogId?: string;
}


export class OfferingTreePolicyDto {

  @ApiProperty({ required: false })
  platformId?: number;

  @ApiProperty({ required: false })
  deviceTypeId?: number;

  @ApiProperty()
  projectId?: number;

  @ApiProperty()
  catalogId?: string;

  @ApiProperty()
  latest?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: OfferingTreePolicyEntity): OfferingTreePolicyDto {
    const dto = new OfferingTreePolicyDto();
    Object.assign(dto, {
      platformId: entity.platform?.id,
      deviceTypeId: entity.deviceType?.id,
      projectId: entity.project?.id,
      catalogId: entity.release?.catalogId,
      latest: entity.release?.latest,
      createdAt: entity.createdDate,
      updatedAt: entity.lastUpdatedDate,
    });
    return dto;
  }
}

export class OfferingTreePolicyParams {

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  platformId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  deviceTypeId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  projectId?: number;
}
