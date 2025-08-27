import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";

export class DeviceDiscoverDto{

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  produceTime: Date;

  @ApiProperty({isArray: true, type: String})
  @IsArray()
  @IsString({ each: true }) 
  comps: string[]
}