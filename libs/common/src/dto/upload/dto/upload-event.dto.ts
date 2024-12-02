import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum UploadEventEnum {
  ERROR = 'error',
  READY = 'ready',
}

export class UploadEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  OS: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  formation: string;

  @ApiProperty({ description: 'Event status', enum: UploadEventEnum, example: UploadEventEnum.READY })
  @IsEnum(UploadEventEnum)
  event: UploadEventEnum;

  @ApiProperty()
  @IsBoolean()
  latest: boolean;

  constructor(
    catalogId: string,
    name: string,
    platform: string,
    formation: string,
    OS: string,
    event: UploadEventEnum,
    latest: boolean
  ) {
    this.catalogId = catalogId;
    this.name = name;
    this.platform = platform;
    this.formation = formation;
    this.OS = OS;
    this.event = event;
    this.latest = latest;
  }
  
  toString(){
    return JSON.stringify(this);
  }
}