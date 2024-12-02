import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class SetDevicesInGroupDto {
  @ApiProperty({required: true})
  @IsNumber()
  id: number
  
  @ApiProperty({required: false})
  @IsArray()
  @IsString({ each: true })
  devices: string[];


  @ApiProperty({required: false})
  @IsArray()
  @IsString({ each: true })
  groups: string[];

  toString(){
    return JSON.stringify(this);
  }

}
