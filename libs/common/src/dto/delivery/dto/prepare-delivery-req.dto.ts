import { ItemTypeEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

  /**
   * Custom absolute path for downloaded files.
   * Used only for A2A compatibility — the downstream agent (e.g. GetMap)
   * passes its local storage path through the intermediary agent's CORE API.
   * Not consumed by the server itself at this time.
   */
  @ApiProperty({ required: false, description: 'Custom download folder path — used for agent CORE A2A relay, not consumed by the server.' })
  @IsString()
  @IsOptional()
  downloadFolder?: string;

  toString(){
    return JSON.stringify(this);
  }
} 