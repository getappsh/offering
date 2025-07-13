import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateDevicesGroupDto {

  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
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
