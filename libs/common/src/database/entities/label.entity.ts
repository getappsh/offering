import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ProjectEntity  } from './project.entity';
import { BaseEntity } from './base.entity';

@Entity('labels')
export class LabelEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => ProjectEntity, project => project.label)
  projects: ProjectEntity[];
}
