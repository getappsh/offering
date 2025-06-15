import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { DeviceMapStateEntity } from "./device-map-state.entity";
import { OrgUIDEntity } from "./org-uid.entity";
import { DeviceComponentEntity } from "./device-component-state.entity";
import { PlatformEntity } from "./platform.entity";
import { ReleaseEntity } from "./release.entity";
import { DeviceTypeEntity } from "./device-type.entity";

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

  @ManyToOne(() => PlatformEntity, { nullable: true, eager: true, onUpdate: "CASCADE" })
  @JoinColumn({ name: "platform_name" })
  platform?: PlatformEntity;

  @ManyToOne(() => DeviceTypeEntity, { nullable: true, eager: true, onUpdate: "CASCADE" })
  @JoinColumn({ name: "device_type" })
  deviceType?: DeviceTypeEntity;

  @Column({ nullable: true })
  name: string;

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
  availableStorage: string;

  @ManyToOne(() => DeviceEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "parent" })
  parent: DeviceEntity;

  @ManyToMany(() => ReleaseEntity, releaseEntity => releaseEntity.devices, {
    cascade: true
  })

  @OneToMany(() => DeviceComponentEntity, deviceComp => deviceComp.device, { cascade: true })
  components: DeviceComponentEntity[];

  @OneToMany(() => DeviceMapStateEntity, deviceMapState => deviceMapState.device, { cascade: true })
  maps: DeviceMapStateEntity[];

  @OneToOne(type => OrgUIDEntity, org => org.device, { nullable: true })
  orgUID: OrgUIDEntity

  @ManyToMany(() => PlatformEntity, { eager: true })
  @JoinTable({
    name: "device_platforms",
    joinColumn: { name: "device_ID", referencedColumnName: "ID" },
    inverseJoinColumn: { name: "platform_name", referencedColumnName: "name" },
  })
  platforms: PlatformEntity[];

  @Column("text", { name: "formations", array: true, nullable: true })
  formations: string[];

}