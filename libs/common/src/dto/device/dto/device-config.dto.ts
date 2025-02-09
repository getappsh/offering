
import { DeviceConfigEntity } from "@app/common/database/entities/device-config.entity";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validate, ValidateNested, ValidationError } from "class-validator";
import { LayersConfigDto } from "./layer-config.dto";


export enum TargetStoragePolicy {
  SD_ONLY = "SDOnly",
  FLASH_THEN_SD = "FlashThenSD",
  SD_THEN_FLASH = "SDThenFlash",
  FLASH_ONLY = "FlashOnly"
}

export class BaseConfigDto{
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  group: string

  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  lastConfigUpdateDate: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  minAvailableSpaceMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  periodicInventoryIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  periodicConfIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  periodicMatomoIntervalMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  lastCheckingMapUpdatesDate: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  deliveryTimeoutMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  MaxMapAreaSqKm: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  maxMapSizeInMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  maxParallelDownloads: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  downloadRetryTime: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  downloadTimeoutMins: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  mapMinInclusionInPercentages: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  matomoUrl: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  matomoDimensionId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  matomoSiteId: string
}


export class WindowsConfigDto extends BaseConfigDto {

  @ApiProperty({ required: false, type: [LayersConfigDto] }) // Specify type as a single object
  @IsOptional()
  @ValidateNested()
  @IsArray()
  @Type(() => LayersConfigDto)
  @Expose()
  layers: LayersConfigDto[];

  constructor() {
    super();
    this.group = 'windows'
  }

  static fromConfigEntity(eConfig: DeviceConfigEntity): WindowsConfigDto {
    let config = new WindowsConfigDto();
    config.group = eConfig.group;
    for (const key in eConfig.data) {
      config[key] = eConfig.data[key]
    }
    return config
  }

  toString() {
    return JSON.stringify(this)
  }

}

export class AndroidConfigDto extends BaseConfigDto {

  constructor() {
    super();
    this.group = 'android'
  }

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  sdStoragePath: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  flashStoragePath: string

  @ApiProperty({ enum: TargetStoragePolicy, required: false, default: TargetStoragePolicy.SD_ONLY })
  @IsOptional()
  @IsEnum(TargetStoragePolicy)
  @Expose()
  targetStoragePolicy: TargetStoragePolicy


  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  sdInventoryMaxSizeMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Expose()
  flashInventoryMaxSizeMB: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  ortophotoMapPath: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  controlMapPath: string

  static fromConfigEntity(cE: DeviceConfigEntity) {
    const config = new AndroidConfigDto()
    config.group = cE.group;
    for (const key in cE.data) {
      config[key] = cE.data[key]
    }
    return config
  }

  toString() {
    return JSON.stringify(this)
  }
}



export function fromConfigEntity(eConfig: DeviceConfigEntity): AndroidConfigDto | WindowsConfigDto {
  let config: AndroidConfigDto | WindowsConfigDto;
  if (eConfig.group === 'android') {
    config = new AndroidConfigDto();
  } else {
    config = new WindowsConfigDto();
  }
  config.lastConfigUpdateDate = eConfig.lastUpdatedDate;
  for (const key in eConfig.data) {
    config[key] = eConfig.data[key];
  }
  return config;
}


@Injectable()
export class DeviceConfigValidator implements PipeTransform {

  getErrorMes(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    function collectConstraints(error: ValidationError) {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints));
      }
      if (error.children) {
        error.children.forEach(collectConstraints); // Recursively process child errors
      }
    }

    errors.forEach(collectConstraints);
    return messages;
  }


  async transform(value: AndroidConfigDto | WindowsConfigDto | BaseConfigDto) {

    const base = plainToClass(BaseConfigDto, { ...value });
    const baseErrors = await validate(base);

    if (baseErrors.length !== 0) {
      throw new BadRequestException(Object.values(baseErrors[0].constraints));
    }

    if (base.group === 'windows') {
      const windows = plainToClass(WindowsConfigDto, value, { excludeExtraneousValues: true, exposeUnsetFields: false });
      const errors = await validate(windows);
      if (errors.length !== 0) {
        throw new BadRequestException(this.getErrorMes(errors));
      }
      return windows
    } else {
      const android = plainToClass(AndroidConfigDto, value, { excludeExtraneousValues: true, exposeUnsetFields: false });
      const errors = await validate(android);
      if (errors.length !== 0) {
        throw new BadRequestException(Object.values(errors[0].constraints));
      }
      return android
    }
  }
}
