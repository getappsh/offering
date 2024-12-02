import { DeviceEntity, DiscoveryMessageEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class DeviceDto {

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: false })
  @IsDate()
  lastUpdatedDate: Date
 
  @ApiProperty({ required: false })
  @IsDate()
  lastConnectionDate: Date
 
  @ApiProperty({ required: false })
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsString()
  OS: string

  @ApiProperty({ required: false })
  @IsString()
  availableStorage: string

  @ApiProperty({ required: false })
  @Min(0)
  @Max(100)
  power: number;

  @ApiProperty({ required: false })
  @IsNumber()
  bandwidth: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  operativeState: true


  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  groupName: string


  @ApiProperty({required: false})
  @IsNumber()
  @IsOptional()
  groupId: number


  @ApiProperty({required: false})
  @IsNumber()
  @IsOptional()
  uid: number


  static fromDeviceEntity(deviceE: DeviceEntity, discoveryE: DiscoveryMessageEntity): DeviceDto {
    let device = new DeviceDto()
    device.id = deviceE.ID;
    device.lastUpdatedDate = deviceE.lastUpdatedDate
    device.lastConnectionDate = deviceE.lastConnectionDate
    device.name = deviceE.name
    device.OS = deviceE.OS
    device.availableStorage = deviceE.availableStorage;
    device.power = discoveryE?.situationalDevice.power;
    device.bandwidth = discoveryE?.situationalDevice.bandwidth;
    device.operativeState = discoveryE?.situationalDevice.operativeState;

    device.uid = deviceE?.orgUID?.UID;
    device.groupId = deviceE?.orgUID?.group?.id;
    device.groupName = deviceE?.orgUID?.group?.name;

    return device
  }

  toString() {
    return JSON.stringify(this);
  }
}