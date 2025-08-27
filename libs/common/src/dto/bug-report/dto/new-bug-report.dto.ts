import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";


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
  

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;


  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  logLevel?: string;


  toString() {
    return JSON.stringify(this)
  }

}