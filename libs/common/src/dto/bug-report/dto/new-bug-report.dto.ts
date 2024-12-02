import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class NewBugReportDto {


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agentVersion: string
  
  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  description: string


  toString() {
    return JSON.stringify(this)
  }

}