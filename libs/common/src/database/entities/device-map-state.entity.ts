import { Entity, ManyToOne, Column, JoinColumn, Unique, PrimaryColumn } from 'typeorm';
import { DeviceMapStateEnum } from './enums.entity';
import { DeviceEntity } from './device.entity';
import { MapEntity } from './map.entity';
import { BaseEntity } from './base.entity';

@Entity("device_map")
@Unique('device_map_unique_constraint', ['device', 'map'])
export class DeviceMapStateEntity extends BaseEntity {

  @ManyToOne(() => DeviceEntity, { nullable: false })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => MapEntity, { nullable: false })
  @JoinColumn({ name: "map_catalog_id" })
  map: MapEntity;

  @Column({ name: "state", type: "enum", enum: DeviceMapStateEnum, default: DeviceMapStateEnum.IMPORT })
  state: DeviceMapStateEnum;

  toString() {
    return JSON.stringify(this)
  }

}