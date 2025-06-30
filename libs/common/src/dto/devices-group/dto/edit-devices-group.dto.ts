import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class EditDevicesGroupDto {
  @ApiProperty({required: true})
  @IsNumber()
  id: number
  
  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  description: string

  toString(){
    return JSON.stringify(this);
  }
}
