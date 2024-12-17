import { DeviceMapStateEntity, DeviceMapStateEnum, MapEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { MapDto } from "./map.dto";

export class MapStateDto {

  @ApiProperty({ required: false , type: MapDto})
  map: MapDto;

  @ApiProperty({ required: false, enum: DeviceMapStateEnum })
  state: DeviceMapStateEnum;

  static fromMapStateEntity(mapStateEntity: DeviceMapStateEntity) {

    let map = new MapStateDto();
    map.map = MapDto.fromMapEntity(mapStateEntity.map)
    map.state = mapStateEntity.state

    return map
  }

  toString() {
    return JSON.stringify(this);
  }
}