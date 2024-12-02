import { ApiProperty } from "@nestjs/swagger";
import { OfferingMapResDto, OfferingResponseDto } from "@app/common/dto/offering";

export class DiscoveryResDto{

  @ApiProperty({required: false, type: OfferingResponseDto})
  software: OfferingResponseDto;

  @ApiProperty({required: false, type: OfferingMapResDto})
  map: OfferingMapResDto;
}