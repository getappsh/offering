import { ProductEntity } from "@app/common/database/entities";
import { MCLink, MCRasterRecordDto } from "@app/common/dto/libot/dto/recordsRes.dto";
import { FootprintValidator } from "@app/common/validators/footprint.validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { PropertiesPolygonPartsDto } from "../../libot/dto/recordsResPolygonParts.dto";
import { Feature, Polygon } from "@turf/turf";

export class ProductLinkDto {
  url: string
  schema: string
  name: string
  description: string

  static fromMCLinks(mcLink: MCLink) {
    const pLinks = new ProductLinkDto()
    pLinks.url = mcLink["#text"]
    pLinks.schema = mcLink.scheme
    pLinks.name = mcLink.name
    pLinks.description = mcLink.description

    return pLinks
  }

  static toString() {
    return JSON.stringify(this)
  }
}

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
  @IsNotEmpty()
  @ApiProperty({ required: false })
  catalogId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  countries: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  cities: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  resolutionMeter: number;

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

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  region: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ingestionDate: Date;

  links?: ProductLinkDto[]

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
    product.imagingTimeBeginUTC = new Date(records["mc:imagingTimeBeginUTC"]);
    product.imagingTimeEndUTC = new Date(records["mc:imagingTimeEndUTC"]);
    product.maxResolutionDeg = Number(records["mc:maxResolutionDeg"])
    product.footprint = records["mc:footprint"]
    product.region = records["mc:region"]
    product.ingestionDate = new Date(records["mc:ingestionDate"]);
    return product
  }

  static fromRecordsResWithLinks(records: MCRasterRecordDto): MapProductResDto {
    const product = MapProductResDto.fromRecordsRes(records)
    product.links = records["mc:links"].map(l => ProductLinkDto.fromMCLinks(l))
    return product
  }

  static fromRecordsResPolygonParts(records: Feature<Polygon, PropertiesPolygonPartsDto>): MapProductResDto {
    const product = new MapProductResDto()
    product.id = records.properties.id
    product.catalogId = records.properties.catalogId
    product.productId = records.properties.productId
    product.productName = process.env.SEQUENTIAL_PRODUCT_ID?.split("-")[0] ?? ""
    product.productVersion = Number(records.properties.productVersion)
    product.productType = records.properties.productType
    product.ingestionDate = new Date(records.properties.ingestionDateUTC);
    product.imagingTimeBeginUTC = new Date(records.properties.imagingTimeBeginUTC);
    product.imagingTimeEndUTC = new Date(records.properties.imagingTimeEndUTC);
    product.footprint = JSON.stringify(records.geometry)
    product.maxResolutionDeg = Number(records.properties.resolutionDegree)
    product.resolutionMeter = records.properties.resolutionMeter
    product.countries = records.properties.countries
    product.cities = records.properties.cities
    product.region = MapProductResDto.productRegionSelector(product.countries, product.cities)

    return product
  }

  static productRegionSelector(countries: string, cities: string | null) {
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
    product.imagingTimeBeginUTC = new Date(pE.imagingTimeBeginUTC);
    product.imagingTimeEndUTC = new Date(pE.imagingTimeEndUTC);
    product.maxResolutionDeg = Number(pE.maxResolutionDeg)
    product.footprint = pE.footprint
    product.region = pE.region
    product.ingestionDate = new Date(pE.ingestionDate);

    return product
  }


}