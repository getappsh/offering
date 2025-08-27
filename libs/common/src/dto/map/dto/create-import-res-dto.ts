import { ApiProperty } from "@nestjs/swagger";
import { MapProductResDto } from "./map-product-res.dto";
import { ImportResDto } from "./import-res-dto";

export class CreateImportResDto extends ImportResDto {

  @ApiProperty({type: MapProductResDto, required: false})
  product: MapProductResDto

  toString() {
    return JSON.stringify(this);
  }
}