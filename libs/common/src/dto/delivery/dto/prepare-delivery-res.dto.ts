import { PrepareStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";


export class PrepareDeliveryResDto{
  @ApiProperty()
  catalogId: string;

  @ApiProperty({enum: PrepareStatusEnum})
  status: PrepareStatusEnum

  @ApiProperty({required: false})
  url: string;

  toString(){
    return JSON.stringify(this);
  }
}