import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { PlatformEntity } from "./platform.entity";
import { DeviceTypeEntity } from "./device-type.entity";
import { ReleaseEntity } from "./release.entity";
import { BaseEntity } from "./base.entity";

@Entity("offering_tree_policy")
@Index(["platform", "deviceType", "project"], { unique: true })
export class OfferingTreePolicyEntity extends BaseEntity {

  @ManyToOne(() => PlatformEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "platform_id" })
  platform?: PlatformEntity;

  @ManyToOne(() => DeviceTypeEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "device_type_id" })
  deviceType?: DeviceTypeEntity;

  @ManyToOne(() => ProjectEntity, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "project_id" })
  project: ProjectEntity;

  @ManyToOne(() => ReleaseEntity, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "catalog_id" })
  release: ReleaseEntity;
}
