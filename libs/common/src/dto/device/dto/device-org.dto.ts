import { DeviceEntity, DiscoveryMessageEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { DeviceDto } from "./device.dto";

export class DeviceOrgDto {

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  groupName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  platformName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deviceTypeName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  groupId?: number

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  uid?: number

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  devices?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deviceParentId?: string;


  static fromDeviceEntity(deviceE: DeviceEntity, discoveryE?: DiscoveryMessageEntity): DeviceOrgDto {
    let device = new DeviceOrgDto()
    device.id = deviceE.ID;
    device.name = deviceE.name

    // Group relation
    device.uid = deviceE?.orgUID?.UID;
    device.groupId = deviceE?.orgUID?.group?.id;
    device.groupName = deviceE?.orgUID?.group?.name;
    device.devices = deviceE.children?.length ? deviceE.children?.map(d => d.ID) : undefined;
    device.deviceParentId = deviceE?.parent?.ID;

    // Org type relation    
    device.platformName = deviceE?.platform?.name;
    device.deviceTypeName = deviceE?.deviceType?.name;

    return device
  }

  static fromDeviceDto(deviceDto: DeviceDto): DeviceOrgDto {
    let device = new DeviceOrgDto();
    device.id = deviceDto.id;
    device.name = deviceDto.name;
    device.groupName = deviceDto.groupName;
    device.platformName = deviceDto.platformName;
    device.deviceTypeName = deviceDto.deviceTypeName;
    device.groupId = deviceDto.groupId;
    device.uid = deviceDto.uid;
    device.devices = deviceDto.devices;
    device.deviceParentId = deviceDto.deviceParentId;
    return device;
  }

  toString() {
    return JSON.stringify(this);
  }
}