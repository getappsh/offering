import { IsArray, ValidateNested } from "class-validator"
import { MapDto } from "../../map"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class OfferingMapPushResDto {

  @ApiProperty({required: false, type: [MapDto]})
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => MapDto)
  push: MapDto[]


  toString(){
    return JSON.stringify(this)
  }
}