import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"


export class DiscoveryMapDto {
    
  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  productVersion: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  productType: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  boundingBox: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  crs: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  imagingTimeStart: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  imagingTimeEnd: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  creationDate: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  source: string;
  
  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  classification: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  compartmentalization: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  region: string;
  
  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  sensor: string;
  
  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  precisionLevel: string;
  
  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @ApiProperty({required: false, type: [String]})
  @IsArray()
  @IsString({each: true})
  @IsNotEmpty({each: true})
  @IsOptional()
  @Type(() => String)
  inventory: string[]

  toString(){
    return JSON.stringify(this);
  }

}