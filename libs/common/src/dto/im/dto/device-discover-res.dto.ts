import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ComponentV2Dto } from "../../upload";

export class DeviceDiscoverResDto{

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  produceTime: Date;

  @ApiProperty({type: [ComponentV2Dto]})
  @ValidateNested({each:true})
  @IsArray()
  @Type(() => ComponentV2Dto)
  comps: ComponentV2Dto[]
}