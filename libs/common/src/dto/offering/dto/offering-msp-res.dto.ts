import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { OfferingMapProductsResDto } from "./offering-map-products-res.dto";
import { OfferingMapPushResDto } from "./offering-map-push-res.dto";


export class OfferingMapResDto extends IntersectionType(
  OfferingMapPushResDto,
  OfferingMapProductsResDto,
){


  toString(){
    return JSON.stringify(this)
  }
}