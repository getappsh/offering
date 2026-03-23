import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { OS } from './enums.entity';

@Entity('os')
export class OSEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
