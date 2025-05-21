import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, ValidateNested } from "class-validator";
import { MapProductResDto } from "../../map/dto/map-product-res.dto";
import { ErrorDto } from "../../error";
import { Type } from "class-transformer";

export enum GetRecordMethod {
  SINGLE = 'single',
  POLYGON_PARTS = 'polygonParts',
}


export enum MapOfferingStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

export class mapOfferingConfig {
  @ApiProperty({ required: false })
  exportMaxResolutionDeg: number

  constructor(maxResolutionDeg?: number) {
    this.exportMaxResolutionDeg = maxResolutionDeg
  }

  toString() {
    return JSON.stringify(this)
  }
}

export class OfferingMapProductsResDto {
  @ApiProperty({ required: false, type: MapProductResDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MapProductResDto)
  products: MapProductResDto[];

  @ApiProperty({ required: false })
  configs: mapOfferingConfig

  @ApiProperty({ enum: GetRecordMethod, default: GetRecordMethod.POLYGON_PARTS })
  @IsEnum(GetRecordMethod)
  method: GetRecordMethod

  @ApiProperty({ enum: MapOfferingStatus })
  @IsEnum(MapOfferingStatus)
  status: MapOfferingStatus

  @ApiProperty({ required: false })
  error: ErrorDto

  toString() {
    return JSON.stringify(this)
  }
}