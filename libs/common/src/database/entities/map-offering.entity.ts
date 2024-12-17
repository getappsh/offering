import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { UploadVersionEntity } from "./upload-version.entity";
import { OfferingActionEnum } from "./enums.entity";
import { BaseEntity } from "./base.entity";
import { MapEntity } from "./map.entity";


@Entity("map_offering")
@Unique('map_offering_unique_constraint', ['device', 'map'])
export class MapOfferingEntity extends BaseEntity{


  @ManyToOne(() => DeviceEntity, { nullable: false })
  @JoinColumn({ name: "device_ID" })
  device: DeviceEntity;

  @ManyToOne(() => MapEntity, { nullable: false })
  @JoinColumn({ name: "map_catalog_id" })
  map: MapEntity;

  @Column({ name: "action", type: "enum", enum: OfferingActionEnum, default: OfferingActionEnum.OFFERING })
  action: OfferingActionEnum
}