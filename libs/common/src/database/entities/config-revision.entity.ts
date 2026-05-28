import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ConfigGroupEntity } from './config-group.entity';
import { ConfigRevisionStatus } from './enums.entity';

/**
 * Represents a versioned snapshot of configuration for a CONFIG or CONFIG_MAP project.
 *
 * Lifecycle:
 *   DRAFT  → one mutable draft per project at a time
 *   ACTIVE → the currently applied revision (at most one per project)
 *   ARCHIVED → previous revisions, preserved for history
 *
 * When `applyRevision()` is called:
 *   - The current ACTIVE revision is moved to ARCHIVED
 *   - The DRAFT becomes ACTIVE
 *   - A new DRAFT is automatically created (with no groups) for subsequent edits
 */
@Entity('config_revision')
export class ConfigRevisionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjectEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'revision_number', type: 'int' })
  revisionNumber: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ConfigRevisionStatus,
    default: ConfigRevisionStatus.DRAFT,
  })
  status: ConfigRevisionStatus;

  @Column({ name: 'applied_by', type: 'varchar', nullable: true })
  appliedBy: string | null;

  @Column({ name: 'applied_at', type: 'timestamptz', nullable: true })
  appliedAt: Date | null;

  /**
   * Semantic version string (e.g. "1.0.0") computed when this revision is
   * promoted from DRAFT → ACTIVE. Null for DRAFT revisions and for any revision
   * that existed before this feature was introduced.
   */
  @Column({ name: 'sem_ver', type: 'varchar', nullable: true })
  semVer: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => ConfigGroupEntity, (group: ConfigGroupEntity) => group.revision, { cascade: true })
  groups: ConfigGroupEntity[];
}
