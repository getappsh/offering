import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { OfferingActionEnum } from "./enums.entity";
import { BaseEntity } from "./base.entity";
import { ReleaseEntity } from "./release.entity";


@Entity("component_offering")
@Unique('device_release_offering_unique_constraint', ['device', 'release'])
export class ComponentOfferingEntity extends BaseEntity{


  @ManyToOne(() => DeviceEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => ReleaseEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "release_catalog_id" })
  release: ReleaseEntity;

  @Column({ name: "action", type: "enum", enum: OfferingActionEnum, default: OfferingActionEnum.OFFERING })
  action: OfferingActionEnum
}