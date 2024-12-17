import { DeviceEntity, DeviceMapStateEnum, DiscoveryMessageEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { DeviceDto } from "./device.dto";
import { MapStateDto } from "../../map/dto/map-state.dto";

export class DeviceMapDto extends DeviceDto {

  @ApiProperty({ isArray: true, type: MapStateDto })
  @IsNotEmpty()
  maps: MapStateDto[];

  static fromDeviceMapEntity(dme: DeviceEntity, discoveryE: DiscoveryMessageEntity): DeviceMapDto {
    if(!dme.maps){
      throw new Error("device entity must have a maps property")
    }

    let device = super.fromDeviceEntity(dme, discoveryE) as DeviceMapDto
    device.maps = dme.maps.map(map => MapStateDto.fromMapStateEntity(map))

    return device
  }

  toString() {
    return JSON.stringify(this);
  }
}


export class DeviceMapStateDto{
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({enum: DeviceMapStateEnum })
  @IsEnum(DeviceMapStateEnum)
  state: DeviceMapStateEnum;

  toString(){
    return JSON.stringify(this);
  }
}
