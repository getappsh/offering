import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { UploadVersionEntity } from "./upload-version.entity";
import { OfferingActionEnum } from "./enums.entity";
import { BaseEntity } from "./base.entity";


@Entity("component_offering")
@Unique('component_offering_unique_constraint', ['device', 'component'])
export class ComponentOfferingEntity extends BaseEntity{


  @ManyToOne(() => DeviceEntity, { nullable: false })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => UploadVersionEntity, { nullable: false })
  @JoinColumn({ name: "component_catalog_id" })
  component: UploadVersionEntity;

  @Column({ name: "action", type: "enum", enum: OfferingActionEnum, default: OfferingActionEnum.OFFERING })
  action: OfferingActionEnum
}