import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DeliveryStatusEnum, ItemTypeEnum } from "./enums.entity";
import { UploadVersionEntity } from "./upload-version.entity";
import { DeviceEntity } from "./device.entity";



@Entity("delivery_status")
@Unique('UQ_deviceID_catalogId_itemKey', ['device', 'catalogId', 'itemKey'])
export class DeliveryStatusEntity extends BaseEntity {

  @ManyToOne(() => DeviceEntity)
  @JoinColumn()
  device: DeviceEntity

  @Column({ name: 'catalogId', nullable: false })
  catalogId: string;

  @Column({ name: "item_key", default: "" })
  itemKey: string;

  @Column({
    name: 'delivery_status',
    type: "enum",
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.START
  })
  deliveryStatus: DeliveryStatusEnum


  @Column({
    name: 'type',
    type: "enum",
    enum: ItemTypeEnum,
    default: ItemTypeEnum.SOFTWARE
  })
  type: ItemTypeEnum

  @Column({ name: 'download_start', type: 'timestamptz', nullable: true })
  downloadStart: Date;

  @Column({ name: 'download_stop', type: 'timestamptz', nullable: true })
  downloadStop: Date;

  @Column({ name: 'download_done', type: 'timestamptz', nullable: true })
  downloadDone: Date;

  @Column({ name: "bit_number", nullable: true })
  bitNumber: number;

  @Column({ name: "download_speed", type: 'decimal', nullable: true })
  downloadSpeed: number;

  @Column({ name: "progress", type: 'decimal', nullable: true })
  progress: number;

  @Column({ name: 'download_estimate_time', nullable: true })
  downloadEstimateTime: number;

  @Column({ name: 'current_time', type: 'timestamptz', nullable: true })
  currentTime: Date;

  toString() {
    return JSON.stringify(this)
  }
}