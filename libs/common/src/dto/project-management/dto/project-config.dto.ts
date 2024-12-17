import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class ProjectConfigDto {

  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String]})
  @IsOptional()
  platforms: string | string[]

  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String]})
  @IsOptional()
  formations: string | string[]

  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String]})
  @IsOptional()
  categories: string | string[]

  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String]})
  @IsOptional()
  operationsSystem: string | string[]

  toString() {
    return JSON.stringify(this);
  }

}