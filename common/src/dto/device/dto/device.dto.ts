import { DeviceEntity, DiscoveryMessageEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

// TODO: extend DeviceDto from DeviceOrgDto to avoid code duplication
export class DeviceDto {

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: false })
  @IsDate()
  lastUpdatedDate?: Date

  @ApiProperty({ required: false })
  @IsDate()
  lastConnectionDate?: Date

  @ApiProperty({ required: false })
  @IsString()
  name?: string

  @ApiProperty({ required: false })
  @IsString()
  OS?: string

  @ApiProperty({ required: false })
  @IsString()
  availableStorage?: string

  @ApiProperty({ required: false })
  @Min(0)
  @Max(100)
  power?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  bandwidth?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  operativeState?: true
  
  @ApiProperty({ required: false })
  @IsBoolean()
  metaData?: Record<string, any>;


  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  groupName?: string


  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  groupId?: number


  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  uid?: number

  /**
   * @deprecated This property is deprecated and will be removed in future versions.
   */
  @ApiProperty({ required: false, type: 'string', isArray: true })
  formations?: string[]

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  platformName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deviceTypeName?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  devices?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deviceParentId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deviceParentName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  deviceParentUid?: number;

  static fromDeviceEntity(deviceE: DeviceEntity, discoveryE?: DiscoveryMessageEntity): DeviceDto {
    let device = new DeviceDto()
    device.id = deviceE.ID;
    device.lastUpdatedDate = deviceE.lastUpdatedDate
    device.lastConnectionDate = deviceE.lastConnectionDate
    device.name = deviceE.name
    device.OS = deviceE.OS
    device.availableStorage = deviceE.availableStorage || discoveryE?.situationalDevice?.availableStorage;
    device.formations = deviceE.formations;
    device.power = discoveryE?.situationalDevice?.power;
    device.bandwidth = discoveryE?.situationalDevice?.bandwidth;
    device.operativeState = discoveryE?.situationalDevice?.operativeState;
    device.metaData = discoveryE?.metaData;

    // Group relation
    device.uid = deviceE?.orgUID?.UID;
    device.groupId = deviceE?.orgUID?.group?.id;
    device.groupName = deviceE?.orgUID?.group?.name;
    device.devices = deviceE.children?.length ? deviceE.children?.map(d => d.ID) : undefined;
    device.deviceParentId = deviceE?.parent?.ID;
    device.deviceParentName = deviceE?.parent?.name;
    device.deviceParentUid = deviceE?.parent?.orgUID?.UID;

    // Org type relation    
    device.platformName = deviceE?.platform?.name;
    device.deviceTypeName = deviceE?.deviceType?.map(dt => dt.name).join(", ");

    return device
  }

  toString() {
    return JSON.stringify(this);
  }
}