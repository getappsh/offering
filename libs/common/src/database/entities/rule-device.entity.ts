import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Index, Column } from 'typeorm';
import { RuleEntity } from './rule.entity';
import { DeviceEntity } from './device.entity';

@Entity('rule_devices')
@Index(['rule', 'device'], { unique: true })
export class RuleDeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleEntity, rule => rule.deviceAssociations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @ManyToOne(() => DeviceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id', referencedColumnName: 'ID' })
  device: DeviceEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
