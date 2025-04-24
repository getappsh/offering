import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { BaseEntity } from "./base.entity";

@Entity("docs")
export class DocEntity extends BaseEntity {

  @Column({name: 'name'})
  name: string;

  @Column({ name: "is_url", default: false })
  isUrl: boolean;

  @Column({name: 'readme', type: "text", nullable: true })
  readme?: string;

  @Column({ name: "doc_url", nullable: true })
  docUrl?: string;

  @ManyToOne(() => ProjectEntity, (project) => project.docs, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
