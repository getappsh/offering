import { DeviceEntity, DiscoveryMessageEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
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