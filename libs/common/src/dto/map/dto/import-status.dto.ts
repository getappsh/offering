import { MapImportStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";

export class ImportStatusDto{
  
  @ApiProperty({required: false})
  importRequestId : string;

  @ApiProperty({enum: MapImportStatusEnum})
  status: MapImportStatusEnum;

  @ApiProperty({required: false})
  messageLog: string;
  
  toString(){
    return JSON.stringify(this);
  }
}