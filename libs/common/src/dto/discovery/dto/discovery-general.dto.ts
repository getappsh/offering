import { OS } from "@app/common/database/entities";
import { IsValidStringFor } from "@app/common/validators";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";

export class PersonalDiscoveryDto {

  @ApiProperty({required: false})
  @IsString()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  idNumber: string;

  @ApiProperty({required: false})
  @IsString()
  personalNumber: string
}


export class GeoLocationDto{

  @ApiProperty({required: false})
  @IsString()
  lat: string;

  @ApiProperty({required: false})
  @IsString()
  long: string;

  @ApiProperty({required: false})
  @IsString()
  alt: string;
}

export class SituationalDiscoveryDto {

  @ApiProperty({required: false})
  @IsNumber()
  weather: number;

  @ApiProperty({required: false})
  @IsNumber()
  bandwidth: number;

  @ApiProperty({required: false})
  @IsDateString()
  time: Date;

  @ApiProperty({required: false})
  @IsBoolean()
  operativeState: boolean;

  @ApiProperty({required: false})
  @Min(0)
  @Max(100)
  power: number;

  @ApiProperty({required: false})
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location: GeoLocationDto;

}

export class PhysicalDiscoveryDto {

  @ApiProperty({required: false})
  @IsNotEmpty()
  @IsValidStringFor("MAC")
  MAC: string;

  @ApiProperty({required: false})
  @IsNotEmpty()
  @IsValidStringFor("IP")
  IP: string;

  @ApiProperty({required: false})
  @IsNotEmpty()
  @IsString()
  ID: string;

  @ApiProperty({enum: OS})
  @IsNotEmpty()
  @IsEnum(OS)
  OS: OS;

  @ApiProperty({required: false})
  @IsString()
  serialNumber: string;

  @ApiProperty({required: false})
  @IsString()
  possibleBandwidth: string;

  @ApiProperty({required: false})
  @IsString()
  availableStorage: string

}


export class GeneralDiscoveryDto {

  @ApiProperty({required: false})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonalDiscoveryDto)
  personalDevice: PersonalDiscoveryDto;

  @ApiProperty({required: false})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SituationalDiscoveryDto)
  situationalDevice: SituationalDiscoveryDto;


  @ApiProperty({required: false})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PhysicalDiscoveryDto)
  physicalDevice: PhysicalDiscoveryDto;

}