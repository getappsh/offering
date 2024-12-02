import { Entity, ManyToOne, Column, JoinColumn, Unique, PrimaryColumn } from 'typeorm';
import { DeviceComponentStateEnum, DeviceMapStateEnum } from './enums.entity';
import { DeviceEntity } from './device.entity';
import { MapEntity } from './map.entity';
import { BaseEntity } from './base.entity';
import { UploadVersionEntity } from './upload-version.entity';

@Entity("device_component")
@Unique('device_component_unique_constraint', ['device', 'component'])
export class DeviceComponentEntity extends BaseEntity {

  @ManyToOne(() => DeviceEntity, { nullable: false })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => UploadVersionEntity, { nullable: false })
  @JoinColumn({ name: "component_catalog_id" })
  component: UploadVersionEntity;

  @Column({ name: "state", type: "enum", enum: DeviceComponentStateEnum, default: DeviceComponentStateEnum.DELIVERY })
  state: DeviceComponentStateEnum;

  toString() {
    return JSON.stringify(this)
  }

}