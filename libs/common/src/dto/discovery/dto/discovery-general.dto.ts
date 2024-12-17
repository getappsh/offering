import { OS } from "@app/common/database/entities";
import { Deprecated } from "@app/common/decorators";
import { IsValidStringFor } from "@app/common/validators";
import { Pattern } from "@app/common/validators/regex.validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

export class PersonalDiscoveryDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  idNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  personalNumber: string
}


export class GeoLocationDto {

  @ApiProperty()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsString()
  long: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  alt: string;
}

export class SituationalDiscoveryDto {

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weather: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  bandwidth: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  time: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  operativeState: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Min(0)
  @Max(100)
  power: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  availableStorage: string

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location: GeoLocationDto;

}

export class PhysicalDiscoveryDto {

  @ApiProperty({required: false})
  @IsOptional()
  @IsValidStringFor(Pattern.MAC)
  MAC: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsValidStringFor(Pattern.IP)
  IP: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsString()
  ID: string;

  @ApiProperty({ enum: OS, required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(OS)
  OS: OS;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  serialNumber: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  possibleBandwidth: string;

  
  /**
    * @deprecated This field is deprecated and will be removed in the future. use instead SituationalDiscoveryDto.availableStorage
    */
  @ApiProperty({ required: false, deprecated: true })
  @Deprecated()
  @IsOptional()
  @IsString()
  availableStorage: string

}


export class GeneralDiscoveryDto {

  @ApiProperty({required: false})
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonalDiscoveryDto)
  personalDevice: PersonalDiscoveryDto;

  @ApiProperty({required: false})
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SituationalDiscoveryDto)
  situationalDevice: SituationalDiscoveryDto;

  @ApiProperty({required: false})
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PhysicalDiscoveryDto)
  physicalDevice: PhysicalDiscoveryDto;

}