import { Entity, Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn, Index, ManyToMany, JoinTable, } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ReleaseArtifactEntity } from './release-artifact.entity';
import { ReleaseStatusEnum } from './enums.entity';
import { nanoid } from "nanoid";
import { DeviceComponentEntity } from './device-component-state.entity';

@Entity('release')
@Index(['project', 'version'], { unique: true })
export class ReleaseEntity {
  @PrimaryColumn({ name: 'catalog_id' })
  catalogId: string;

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

  @Column({ name: 'required_regulations_count', type: 'int', default: 0 })
  requiredRegulationsCount: number;

  @Column({ name: 'compliant_regulations_count', type: 'int', default: 0 })
  compliantRegulationsCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;


  @ManyToMany(() => ReleaseEntity, (release) => release.dependentReleases, { cascade: true })
  @JoinTable({
    name: 'release_dependencies',
    joinColumn: { name: 'release_id', referencedColumnName: 'catalogId' },
    inverseJoinColumn: { name: 'dependency_release_id', referencedColumnName: 'catalogId' },
  })
  dependencies: ReleaseEntity[];


  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;


  @ManyToMany(() => ReleaseEntity, (release) => release.dependencies)
  dependentReleases: ReleaseEntity[];


  @OneToMany(() => DeviceComponentEntity, deviceCompEntity => deviceCompEntity.release)
  devices: DeviceComponentEntity[]
}