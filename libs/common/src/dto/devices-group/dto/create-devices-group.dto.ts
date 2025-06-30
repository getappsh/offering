import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateDevicesGroupDto {

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string


  toString(){
    return JSON.stringify(this);
  }
}
