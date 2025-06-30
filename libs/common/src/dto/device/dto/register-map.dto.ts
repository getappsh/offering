import { MapEntity } from "@app/common/database/entities";
import { Deprecated } from "@app/common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

@Deprecated()
export class RegisterMapDto {

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  map: MapEntity;

  toString(){
    return JSON.stringify(this);
  }
}