import { Entity, Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn, Index, } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ReleaseArtifactEntity } from './release-artifact.entity';
import { ReleaseStatusEnum } from './enums.entity';
import { nanoid } from "nanoid";

@Entity('release')
@Index(['project', 'version'], { unique: true })
export class ReleaseEntity {
  @PrimaryColumn({ name: 'catalog_id' })
  catalogId: string;

  @BeforeInsert()
  generateUUID() {
    this.catalogId = nanoid();
  }

  @Column({ name: 'version' })
  version: string;

  @Column({ name: 'name', nullable: true })
  name?: string;

  @Column({ name: 'status', type: 'enum', enum: ReleaseStatusEnum, default: ReleaseStatusEnum.DRAFT })
  status: ReleaseStatusEnum;

  @Column({ name: 'release_notes', nullable: true })
  releaseNotes?: string

  @Column({ name: 'metadata', type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToOne(() => ProjectEntity, (project) => project.releases, {nullable: false})
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @OneToMany(() => ReleaseArtifactEntity, (artifact) => artifact.release)
  artifacts: ReleaseArtifactEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}