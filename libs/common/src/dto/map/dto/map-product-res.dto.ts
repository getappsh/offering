import { ProductEntity } from "@app/common/database/entities";
import { MCRasterRecordDto } from "@app/common/dto/libot/dto/recordsRes.dto";
import { FootprintValidator } from "@app/common/validators/footprint.validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { PropertiesPolygonPartsDto } from "../../libot/dto/recordsResPolygonParts.dto";
import { Feature, Polygon } from "@turf/turf";

export class MapProductResDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty()
  // exportId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  catalogId: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // sourceName: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // sourceId: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // sensors: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  countries: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  cities: string | null;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // description: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // horizontalAccuracyCe90: number;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // sourceResolutionMeter: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  resolutionMeter: number;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // resolutionDegree: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  productName: string;

  @ApiProperty({ required: false })
  productVersion: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  productType: string;

  // @ApiProperty({ required: false })
  // productSubType: number;

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

  // @ApiProperty({ required: false })
  // @IsString()
  // @IsOptional()
  // transparency: string

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
    product.catalogId = records["mc:id"]
    product.productId = records["mc:productId"]
    product.productName = records["mc:productName"]
    product.productVersion = Number(records["mc:productVersion"])
    product.productType = records["mc:productType"]
    // product.productSubType = Number(records["mc:productSubType"]) || null ;
    // product.description = records["mc:description"];
    product.imagingTimeBeginUTC = new Date(records["mc:imagingTimeBeginUTC"]);
    product.imagingTimeEndUTC = new Date(records["mc:imagingTimeEndUTC"]);
    product.maxResolutionDeg = Number(records["mc:maxResolutionDeg"])
    product.footprint = records["mc:footprint"]
    // product.transparency = records["mc:transparency"]
    product.region = records["mc:region"]
    product.ingestionDate = new Date(records["mc:ingestionDate"]);
    // product.exportId = product.id
    return product
  }

  static fromRecordsResPolygonParts(records: Feature<Polygon, PropertiesPolygonPartsDto>): MapProductResDto {
    const product = new MapProductResDto()
    product.id = records.properties.id
    product.catalogId = records.properties.catalogId
    product.productId = records.properties.productId
    product.productName = process.env.SEQUENTIAL_PRODUCT_ID?.split("-")[0]
    product.productVersion = Number(records.properties.productVersion)
    product.productType = records.properties.productType
    product.ingestionDate = new Date(records.properties.ingestionDateUTC);
    product.imagingTimeBeginUTC = new Date(records.properties.imagingTimeBeginUTC);
    product.imagingTimeEndUTC = new Date(records.properties.imagingTimeEndUTC);
    product.footprint = JSON.stringify(records.geometry)
    // product.sourceId = records.properties.sourceId
    // product.sourceName = records.properties.sourceName
    product.maxResolutionDeg = Number(records.properties.resolutionDegree)
    product.resolutionMeter = records.properties.resolutionMeter
    // product.sourceResolutionMeter = records.properties.sourceResolutionMeter
    // product.horizontalAccuracyCe90 = records.properties.horizontalAccuracyCe90
    // product.sensors = records.properties.sensors
    product.countries = records.properties.countries
    product.cities = records.properties.cities
    product.region = MapProductResDto.productRegionSelector(product.countries, product.cities)
    // product.exportId = product.catalogId
    // product.description = records.properties.description

    return product
  }

  static productRegionSelector(countries: string, cities: string) {
    if (cities == null) {
      if (countries == null) {
        return ""
      } else {
        return countries.split(',')[0]
      }
    } else {
      return cities.split(',')[0]
    }
  }

  static fromProductEntity(pE: ProductEntity): MapProductResDto {
    const product = new MapProductResDto()
    product.id = pE.id
    product.catalogId = pE.catalogId
    product.productId = pE.productId
    product.productName = pE.productName
    product.productVersion = pE.productVersion
    product.productType = pE.productType
    // product.productSubType = pE.productSubType
    // product.description = pE.description
    product.imagingTimeBeginUTC = new Date(pE.imagingTimeBeginUTC);
    product.imagingTimeEndUTC = new Date(pE.imagingTimeEndUTC);
    product.maxResolutionDeg = Number(pE.maxResolutionDeg)
    product.footprint = pE.footprint
    // product.transparency = pE.transparency
    product.region = pE.region
    product.ingestionDate = new Date(pE.ingestionDate);
    // product.exportId = product.id

    return product
  }


}