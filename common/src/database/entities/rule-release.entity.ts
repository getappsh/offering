import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { RuleEntity } from './rule.entity';
import { ReleaseEntity } from './release.entity';

@Entity('rule_releases')
@Index(['rule', 'release'], { unique: true })
export class RuleReleaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleEntity, rule => rule.releaseAssociations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @ManyToOne(() => ReleaseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'release_catalog_id', referencedColumnName: 'catalogId' })
  release: ReleaseEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
