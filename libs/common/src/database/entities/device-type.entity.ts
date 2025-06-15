import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { PlatformEntity } from "./platform.entity";
import { ProjectEntity } from "./project.entity";

@Entity("device_type")
export class DeviceTypeEntity {

  @PrimaryColumn({ name: "name" })
  name: string;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @ManyToMany(() => PlatformEntity, platform => platform.deviceTypes)
  platforms: PlatformEntity[];

  @ManyToMany(() => ProjectEntity, project => project.deviceTypes, { cascade: true })
  @JoinTable({
    name: "device_type_project",
    joinColumn: { name: "device_type_name", referencedColumnName: "name" },
    inverseJoinColumn: { name: "project_id", referencedColumnName: "id" },
  })
  projects: ProjectEntity[];

}