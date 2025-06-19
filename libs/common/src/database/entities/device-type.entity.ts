import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlatformEntity } from "./platform.entity";
import { ProjectEntity } from "./project.entity";
import { CPUArchitecture, DiskType, NetworkType, OS } from "./enums.entity";

@Entity("device_type")
export class DeviceTypeEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "name", unique: true })
  name: string;

  @Column({ name: "description", type: "text", nullable: true })
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

  @ManyToMany(() => PlatformEntity, platform => platform.deviceTypes)
  platforms: PlatformEntity[];

  @ManyToMany(() => ProjectEntity, project => project.deviceTypes, { cascade: true })
  @JoinTable({
    name: "device_type_project",
    joinColumn: { name: "device_type_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "project_id", referencedColumnName: "id" },
  })
  projects: ProjectEntity[];

}