import { Entity, ManyToOne, Column, JoinColumn, Unique, PrimaryColumn } from 'typeorm';
import { DeviceComponentStateEnum, DeviceMapStateEnum } from './enums.entity';
import { DeviceEntity } from './device.entity';
import { BaseEntity } from './base.entity';
import { ReleaseEntity } from './release.entity';

@Entity("device_component")
@Unique('device_component_unique_constraint', ['device', 'release'])
export class DeviceComponentEntity extends BaseEntity {

  @ManyToOne(() => DeviceEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => ReleaseEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "release_catalog_id" })
  release: ReleaseEntity;

  @Column({ name: "state", type: "enum", enum: DeviceComponentStateEnum, default: DeviceComponentStateEnum.DELIVERY })
  state: DeviceComponentStateEnum;

  @Column({name: 'downloaded_at', type: 'timestamptz', default: null})
  downloadedAt?: Date;

  @Column({name: 'deployed_at', type: 'timestamptz', default: null})
  deployedAt?: Date;

  @Column({name: "error", default: null})
  error?: string;

  toString() {
    return JSON.stringify(this)
  }

}