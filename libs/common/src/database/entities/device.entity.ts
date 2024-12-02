import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UploadVersionEntity } from "./upload-version.entity";
import { DevicesGroupEntity } from "./devices-group.entity";
import { DeviceMapStateEntity } from "./device-map-state.entity";

@Entity("device")
export class DeviceEntity {

  @PrimaryColumn({ name: 'ID' })
  ID: string;

  @CreateDateColumn({name: 'create_date', type: "timestamptz"})
  createdDate: Date;

  @UpdateDateColumn({name: 'last_update_date', type: "timestamptz"})
  lastUpdatedDate: Date;
  
  @Column({name: 'last_connection_date', type: "timestamptz", nullable: true})
  lastConnectionDate: Date;
  
  @Column({nullable: true})
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
  @JoinTable({
    name: "device_component",
    joinColumn: {
      name: 'device_ID',
      referencedColumnName: 'ID'
    },
    inverseJoinColumn: {
      name: "component_catalog_id",
      referencedColumnName: "catalogId"
    },

  })
  components: UploadVersionEntity[];

  @OneToMany(() => DeviceMapStateEntity, deviceMapState => deviceMapState.device, { cascade: true })
  maps: DeviceMapStateEntity[];


  @ManyToOne(type => DevicesGroupEntity, { nullable: true })
  groups: DevicesGroupEntity

}