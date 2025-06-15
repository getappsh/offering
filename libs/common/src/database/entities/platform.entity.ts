import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OS } from "./enums.entity";
import { DeviceTypeEntity } from "./device-type.entity";
import { truncate } from "fs";

@Entity("platform")
export class PlatformEntity {

  @PrimaryColumn({ name: "name" })
  name: string;

  @Column({ name: "description", default: null })
  description?: string;

  @Column({ name: "os", enum: OS, type: 'enum', default: null })
  os?: OS;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @ManyToMany(() => DeviceTypeEntity, deviceType => deviceType.platforms, { cascade: true })
  @JoinTable({
    name: "platform_device_type",
    joinColumn: { name: "platform_name", referencedColumnName: "name" },
    inverseJoinColumn: { name: "device_type_name", referencedColumnName: "name" },
  })
  deviceTypes: DeviceTypeEntity[];
}

