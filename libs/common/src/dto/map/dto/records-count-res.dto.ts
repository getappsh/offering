import { ApiProperty } from "@nestjs/swagger";

export class RecordsCountResDto {
  
  @ApiProperty({required: false})
  count: number

  toString(){
    return JSON.stringify(this);
  }
}