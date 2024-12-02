import { ProductEntity } from "@app/common/database/entities";
import { FootprintValidator } from "@app/common/validators/footprint.validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { MCRasterRecordDto } from "../../libot/dto/recordsRes.dto";

export class MapProductResDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  productId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  productName: string;

  @ApiProperty({ required: false })
  productVersion: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  productType: string;

  @ApiProperty({ required: false })
  productSubType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  imagingTimeBeginUTC: Date;

  @ApiProperty({ required: false })
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  imagingTimeEndUTC: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxResolutionDeg: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(FootprintValidator)
  footprint: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  transparency: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  region: string;

  @ApiProperty({ required: false })
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  ingestionDate: Date;

  toString() {
    return JSON.stringify(this);
  }


  static fromRecordsRes(records: MCRasterRecordDto): MapProductResDto {
    const product = new MapProductResDto()
    product.id = records["mc:id"]
    product.productId = records["mc:productName"]
    product.productName = records["mc:productName"]
    product.productVersion = records["mc:productVersion"]
    product.productType = records["mc:productType"]
    product.productSubType = records["mc:productSubType"];
    product.description = records["mc:description"];
    product.imagingTimeBeginUTC = new Date(records["mc:imagingTimeBeginUTC"]);
    product.imagingTimeEndUTC = new Date(records["mc:imagingTimeEndUTC"]);
    product.maxResolutionDeg = Number(records["mc:maxResolutionDeg"])
    product.footprint = records["mc:footprint"]
    product.transparency = records["mc:transparency"]
    product.region = records["mc:region"]
    product.ingestionDate = new Date(records["mc:ingestionDate"]);

    return product
  }

  static fromProductEntity(pE: ProductEntity): MapProductResDto {
    const product = new MapProductResDto()
    product.id = pE.id
    product.productId = pE.productId
    product.productName = pE.productName
    product.productVersion = pE.productVersion
    product.productType = pE.productType
    product.productSubType = pE.productSubType
    product.description = pE.description
    product.imagingTimeBeginUTC = new Date(pE.imagingTimeBeginUTC);
    product.imagingTimeEndUTC = new Date(pE.imagingTimeEndUTC);
    product.maxResolutionDeg = Number(pE.maxResolutionDeg)
    product.footprint = pE.footprint
    product.transparency = pE.transparency
    product.region = pE.region
    product.ingestionDate = new Date(pE.ingestionDate);

    return product
  }


}