import { Column, Entity, ManyToOne } from "typeorm"
import { ProjectEntity } from "./project.entity";
import { BaseEntity } from "./base.entity";

@Entity("project_token")
export class ProjectTokenEntity extends BaseEntity {

  @ManyToOne(() => ProjectEntity, (project) => project.tokens, { onDelete: 'CASCADE' })
  project: ProjectEntity;

  @Column({ name: 'name'})
  name: string;

  @Column({ name: 'token', unique: true })
  token: string;

  @Column({ name: 'expiration_date', type: "timestamptz", nullable: true })
  expirationDate: Date | null;

  @Column({ name: 'never_expires', type: 'boolean', default: false })
  neverExpires: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean
}