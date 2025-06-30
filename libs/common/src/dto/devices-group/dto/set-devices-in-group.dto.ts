import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class SetChildInGroupDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  devices: string[];
  
  
  @ApiProperty({required: false})
  @IsOptional()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  groups: number[];

  toString() {
    return JSON.stringify(this);
  }

}
