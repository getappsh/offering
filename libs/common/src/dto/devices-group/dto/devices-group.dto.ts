import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { DeviceMapDto } from "../../device/dto/device-map.dto";
import { Type } from "class-transformer";
import { DevicesGroupEntity } from "@app/common/database/entities";

export class DevicesGroupDto {

  @ApiProperty({required: true})
  @IsNumber()
  id: number

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  description: string
  
  @ApiProperty({required: false, type: DeviceMapDto, isArray: true})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => DeviceMapDto)
  devices: DeviceMapDto[];

  @ApiProperty({required: false, type: DevicesGroupDto, isArray: true})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => DevicesGroupDto)
  groups: DevicesGroupDto[];


  static fromDevicesGroupEntity(dge: DevicesGroupEntity): DevicesGroupDto{
    let devicesGroupDto = new DevicesGroupDto();
    devicesGroupDto.id = dge.id;
    devicesGroupDto.name = dge.name;
    devicesGroupDto.description = dge?.description;
    // devicesGroupDto.devices = dge?.devices?.map(d => DeviceMapDto.fromDeviceEntity(d))
    devicesGroupDto.groups = dge?.children?.map(childe => DevicesGroupDto.fromDevicesGroupEntity(childe))

    return devicesGroupDto
  }

  toString(){
    return JSON.stringify(this);
  }

}