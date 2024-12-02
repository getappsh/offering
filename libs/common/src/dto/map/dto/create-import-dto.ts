import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

export class MapProperties {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productId: string;

  @ApiProperty({ type: Number, minimum: 0, maximum: 18, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  zoomLevel: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  boundingBox: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  targetResolution: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  lastUpdateAfter: number;

  toString() {
    return JSON.stringify(this);
  }

}

export class CreateImportDto {

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MapProperties)
  mapProperties: MapProperties;

  toString() {
    return JSON.stringify(this);
  }
}