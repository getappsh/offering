import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AndroidConfigDto, TargetStoragePolicy } from "../../device/dto/device-config.dto";
/**
  * @deprecated This field is deprecated and will be removed in the future.
  */
export class MapConfigDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  deliveryTimeoutMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  MaxMapAreaSqKm: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxMapSizeInMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxParallelDownloads: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  downloadRetryTime: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  downloadTimeoutMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicInventoryIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicConfIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  periodicMatomoIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minAvailableSpaceMB: number

  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mapMinInclusionInPercentages: number
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matomoUrl: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matomoDimensionId: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  matomoSiteId: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sdStoragePath: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  flashStoragePath: string
  
  @ApiProperty({enum: TargetStoragePolicy, required: false, default: TargetStoragePolicy.SD_ONLY})
  @IsOptional()
  @IsEnum(TargetStoragePolicy)
  targetStoragePolicy: TargetStoragePolicy


  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sdInventoryMaxSizeMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  flashInventoryMaxSizeMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  lastCheckingMapUpdatesDate: Date
  
  @ApiProperty({ required: false })
  @IsOptional()
  lastConfigUpdateDate: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ortophotoMapPath: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  controlMapPath: string

  static fromDeviceConfigDto(cE: AndroidConfigDto) {
    const config = new MapConfigDto()
    config.deliveryTimeoutMins = cE.deliveryTimeoutMins
    config.downloadRetryTime = cE.downloadRetryTime
    config.downloadTimeoutMins = cE.downloadTimeoutMins
    config.MaxMapAreaSqKm = cE.MaxMapAreaSqKm
    config.maxMapSizeInMB = cE.maxMapSizeInMB
    config.maxParallelDownloads = cE.maxParallelDownloads
    config.minAvailableSpaceMB = cE.minAvailableSpaceMB
    config.periodicInventoryIntervalMins = cE.periodicInventoryIntervalMins
    config.periodicConfIntervalMins = cE.periodicConfIntervalMins
    config.periodicMatomoIntervalMins = cE.periodicMatomoIntervalMins
    config.mapMinInclusionInPercentages = cE.mapMinInclusionInPercentages
    config.matomoUrl = cE.matomoUrl
    config.matomoDimensionId = cE.matomoDimensionId
    config.matomoSiteId = cE.matomoSiteId
    config.lastConfigUpdateDate = cE.lastConfigUpdateDate
    config.sdStoragePath = cE.sdStoragePath
    config.flashStoragePath = cE.flashStoragePath
    config.targetStoragePolicy = cE.targetStoragePolicy
    config.flashInventoryMaxSizeMB = cE.flashInventoryMaxSizeMB
    config.sdInventoryMaxSizeMB = cE.sdInventoryMaxSizeMB
    config.ortophotoMapPath = cE.ortophotoMapPath
    config.controlMapPath = cE.controlMapPath

    return config
  }

  toString() {
    return JSON.stringify(this)
  }
}