import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, ValidateNested } from "class-validator";
import { MapProductResDto } from "../../map/dto/map-product-res.dto";
import { ErrorDto } from "../../error";
import { Type } from "class-transformer";



export enum MapOfferingStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

export class OfferingMapProductsResDto {
  @ApiProperty({required: false, type: MapProductResDto, isArray: true})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => MapProductResDto)
  products: MapProductResDto[];

  @ApiProperty({enum: MapOfferingStatus})
  @IsEnum(MapOfferingStatus)
  status: MapOfferingStatus

  @ApiProperty({required: false})
  error: ErrorDto
  
  toString() {
    return JSON.stringify(this)
  }
}