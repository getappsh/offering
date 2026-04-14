import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column, Index } from 'typeorm';
import { RuleEntity } from './rule.entity';

@Entity('rule_os')
@Index(['rule', 'osType'], { unique: true })
export class RuleOsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleEntity, rule => rule.osAssociations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @Column({ type: 'varchar', length: 100 })
  osType: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
