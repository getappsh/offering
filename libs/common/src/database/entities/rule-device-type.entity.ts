import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { RuleEntity } from './rule.entity';
import { DeviceTypeEntity } from './device-type.entity';

@Entity('rule_device_types')
@Index(['rule', 'deviceType'], { unique: true })
export class RuleDeviceTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleEntity, rule => rule.deviceTypeAssociations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rule_id' })
  rule: RuleEntity;

  @ManyToOne(() => DeviceTypeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_type_id' })
  deviceType: DeviceTypeEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
