import { DeviceMapStateEntity, DeviceMapStateEnum, MapEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { MapDto } from "./map.dto";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class MapStateDto {

  @ApiProperty({ required: false , type: MapDto})
  map: MapDto;

  @ApiProperty({ required: false, enum: DeviceMapStateEnum })
  state: DeviceMapStateEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  error?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  downloadDate?: Date;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deployDate?: Date;


  static fromMapStateEntity(mapStateEntity: DeviceMapStateEntity) {

    let map = new MapStateDto();
    map.map = MapDto.fromMapEntity(mapStateEntity.map)
    map.state = mapStateEntity.state;
    map.error = mapStateEntity.error;
    map.downloadDate = mapStateEntity.downloadedAt;
    map.deployDate = mapStateEntity.deployedAt;

    return map
  }

  toString() {
    return JSON.stringify(this);
  }
}