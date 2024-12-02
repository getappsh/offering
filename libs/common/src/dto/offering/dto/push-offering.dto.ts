import { ItemTypeEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class PushOfferingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({type: String, isArray: true})
  @IsArray()
  @IsString({each: true})
  devices: string[];

  @ApiProperty({ required: false, type: Number, isArray: true })
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  groups: number[];

  @ApiProperty({ enum: ItemTypeEnum, default: ItemTypeEnum.SOFTWARE })
  @IsEnum(ItemTypeEnum)
  itemType: ItemTypeEnum;

  toString(){
    return JSON.stringify(this);
  }
}