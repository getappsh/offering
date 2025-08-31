import { OfferingTreePolicyEntity } from "@app/common/database/entities";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateOfferingTreePolicyDto {

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  platformId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  deviceTypeId?: number;

  @ApiProperty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsString()
  catalogId: string;
}

export class UpdateOfferingTreePolicyDto extends PartialType(CreateOfferingTreePolicyDto) {
  id: number;
}

export class OfferingTreePolicyDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  platformId?: number;

  @ApiProperty({ required: false })
  deviceTypeId?: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  catalogId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: OfferingTreePolicyEntity): OfferingTreePolicyDto {
    const dto = new OfferingTreePolicyDto();
    Object.assign(dto, {
      id: entity.id,
      platformId: entity.platform?.id,
      deviceTypeId: entity.deviceType?.id,
      projectId: entity.project?.id,
      catalogId: entity.release?.catalogId,
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
