import { ApiProperty } from "@nestjs/swagger";
import { OfferingMapProductsResDto, OfferingResponseDto } from "@app/common/dto/offering";

export class DiscoveryResDto{

  @ApiProperty({required: false, type: OfferingResponseDto})
  software: OfferingResponseDto;

  @ApiProperty({required: false, type: OfferingMapProductsResDto})
  map: OfferingMapProductsResDto;
}