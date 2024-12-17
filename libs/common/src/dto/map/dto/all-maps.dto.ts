import { MapEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { MapDto } from "./map.dto";
import { DeviceDto } from "../../device/dto/device.dto";

export class MapDevicesDto extends MapDto {

  @ApiProperty({required: false})
  devices: DeviceDto[]

  static fromMapEntity(mapEntity: MapEntity, devices?: DeviceDto[]): MapDevicesDto{
    let map :MapDto = super.fromMapEntity(mapEntity);
    let allMaps: MapDevicesDto = {...map, devices}
    return allMaps;
  }

  toString(){
    return JSON.stringify(this);
  }
}