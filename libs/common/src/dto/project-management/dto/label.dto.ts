import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { LabelEntity, ApplicationCategory } from "@app/common/database/entities";

export class LabelDto {
  @ApiProperty({ description: 'Unique identifier of the label' })
  id: number;

  @ApiProperty({ description: 'Name of the label' })
  name: string;

  @ApiProperty({ enum: ApplicationCategory, required: false, description: 'Application category this label belongs to' })
  applicationCategory?: ApplicationCategory;

  static fromLabelEntity(entity: LabelEntity): LabelDto {
    const dto = new LabelDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.applicationCategory = entity.applicationCategory ?? undefined;
    return dto;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class LabelNameDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Name of the label' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEnum(ApplicationCategory)
  @IsOptional()
  @ApiProperty({ enum: ApplicationCategory, required: false, description: 'Filter labels by application category' })
  applicationCategory?: ApplicationCategory;
}
