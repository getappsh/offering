import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

export class DevicesStatisticUnit {

  @ApiProperty()
  @IsNumber()
  sum: number;
  
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  devices: string[];

  toString() {
    return JSON.stringify(this);
  }
}

export class DevicesStatisticInfo {

  @ApiProperty()
  @ValidateNested()
  @Type(() => DevicesStatisticUnit)
  count: DevicesStatisticUnit;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DevicesStatisticUnit)
  updated: DevicesStatisticUnit;
 
  @ApiProperty()
  @ValidateNested()
  @Type(() => DevicesStatisticUnit)
  onUpdateProcess: DevicesStatisticUnit;
 
  @ApiProperty()
  @ValidateNested()
  @Type(() => DevicesStatisticUnit)
  updateError: DevicesStatisticUnit;

  toString() {
    return JSON.stringify(this);
  }
}

