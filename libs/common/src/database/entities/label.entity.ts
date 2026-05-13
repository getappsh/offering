import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ProjectEntity  } from './project.entity';
import { BaseEntity } from './base.entity';
import { ApplicationCategory } from './enums.entity';

@Entity('labels')
export class LabelEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'application_category', type: 'enum', enum: ApplicationCategory, nullable: true })
  applicationCategory: ApplicationCategory | null;

  @OneToMany(() => ProjectEntity, project => project.label)
  projects: ProjectEntity[];
}
