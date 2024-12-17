import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UploadVersionEntity } from "./upload-version.entity";
import { DeviceMapStateEntity } from "./device-map-state.entity";
import { OrgUIDEntity } from "./org-uid.entity";
import { DeviceComponentEntity } from "./device-component-state.entity";

@Entity("device")
export class DeviceEntity {

  @PrimaryColumn({ name: 'ID' })
  ID: string;

  @CreateDateColumn({ name: 'create_date', type: "timestamptz" })
  createdDate: Date;

  @UpdateDateColumn({ name: 'last_update_date', type: "timestamptz" })
  lastUpdatedDate: Date;

  @Column({ name: 'last_connection_date', type: "timestamptz", nullable: true })
  lastConnectionDate: Date;

  @Column({ nullable: true })
  name: string

  @Column({ name: 'MAC', nullable: true })
  MAC: string;

  @Column({ name: 'IP', nullable: true })
  IP: string;

  @Column({ name: 'OS', nullable: true })
  OS: string;

  @Column({ name: 'serial_number', nullable: true })
  serialNumber: string;

  @Column({ name: 'possible_bandwidth', nullable: true })
  possibleBandwidth: string;

  @Column({ name: 'available_storage', nullable: true })
  availableStorage: string

  @ManyToMany(() => UploadVersionEntity, uploadVersionEntity => uploadVersionEntity.devices, {
    cascade: true
  })

  @OneToMany(() => DeviceComponentEntity, deviceComp => deviceComp.device, { cascade: true })
  components: DeviceComponentEntity[];

  @OneToMany(() => DeviceMapStateEntity, deviceMapState => deviceMapState.device, { cascade: true })
  maps: DeviceMapStateEntity[];

  @OneToOne(type => OrgUIDEntity, org => org.device, { nullable: true })
  orgUID: OrgUIDEntity

}