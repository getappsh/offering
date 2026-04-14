import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { RuleType } from '../../rules/enums/rule.enums';
import { RuleReleaseEntity } from './rule-release.entity';
import { RuleDeviceTypeEntity } from './rule-device-type.entity';
import { RuleDeviceEntity } from './rule-device.entity';
import { RuleOsEntity } from './rule-os.entity';

@Entity('rules')
@Index(['type', 'isActive'])
export class RuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: RuleType })
  type: RuleType;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb' })
  rule: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => RuleReleaseEntity, ruleRelease => ruleRelease.rule, { cascade: true })
  releaseAssociations: RuleReleaseEntity[];

  @OneToMany(() => RuleDeviceTypeEntity, ruleDeviceType => ruleDeviceType.rule, { cascade: true })
  deviceTypeAssociations: RuleDeviceTypeEntity[];

  @OneToMany(() => RuleDeviceEntity, ruleDevice => ruleDevice.rule, { cascade: true })
  deviceAssociations: RuleDeviceEntity[];

  @OneToMany(() => RuleOsEntity, ruleOs => ruleOs.rule, { cascade: true })
  osAssociations: RuleOsEntity[];
}
