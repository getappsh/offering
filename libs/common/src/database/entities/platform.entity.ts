import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CPUArchitecture, DiskType, NetworkType, OS } from "./enums.entity";
import { DeviceTypeEntity } from "./device-type.entity";

@Entity("platform")
export class PlatformEntity {

  @PrimaryColumn({ type: 'integer' })
  id: number

  @Column({ name: "name", unique: true })
  name: string;

  @Column({ name: "description", default: null })
  description?: string;

  @Column({ name: "os", enum: OS, type: 'enum', default: null })
  os?: OS;

  @Column({ type: 'enum', enum: CPUArchitecture, default: null })
  cpuArchitecture?: CPUArchitecture;

  @Column({ type: 'int', nullable: true, default: null })
  cpuCount?: number;

  @Column({ type: 'int', nullable: true, default: null })
  memoryMb?: number;

  @Column({ type: 'int', nullable: true, default: null })
  diskGb?: number;

  @Column({ type: 'enum', enum: DiskType, default: null })
  diskType?: DiskType;

  @Column({ type: 'enum', enum: NetworkType, default: null })
  networkType?: NetworkType;

  @Column({ default: null })
  imageId?: string;

  @Column({ type: 'json', default: null  })
  metadata?: Record<string, string>

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @ManyToMany(() => DeviceTypeEntity, deviceType => deviceType.platforms, { cascade: true })
  @JoinTable({
    name: "platform_device_type",
    joinColumn: { name: "platform_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "device_type_id", referencedColumnName: "id" },
  })
  deviceTypes: DeviceTypeEntity[];
}

