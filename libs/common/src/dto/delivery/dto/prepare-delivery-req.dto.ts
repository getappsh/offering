import { ItemTypeEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class PrepareDeliveryReqDto{

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({enum: ItemTypeEnum})
  @IsEnum(ItemTypeEnum)
  itemType: ItemTypeEnum

  toString(){
    return JSON.stringify(this);
  }
} 