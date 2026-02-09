import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum PendingVersionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

@Entity("pending_version")
@Index(['projectName', 'version'], { unique: true })
export class PendingVersionEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'last_updated_date', type: 'timestamptz' })
  lastUpdatedDate: Date;

  @Column({ name: "project_name" })
  projectName: string;

  @Column({ name: "version" })
  version: string;

  @Column({ name: "catalog_id", nullable: true })
  catalogId?: string;

  @Column({ 
    name: "status", 
    type: "enum", 
    enum: PendingVersionStatus, 
    default: PendingVersionStatus.PENDING 
  })
  status: PendingVersionStatus;

  @Column({ name: "reported_count", default: 1 })
  reportedCount: number;

  @Column({ name: "first_reported_date", type: "timestamptz" })
  firstReportedDate: Date;

  @Column({ name: "last_reported_date", type: "timestamptz" })
  lastReportedDate: Date;

  @Column({ name: "reporting_device_ids", type: "jsonb", default: [] })
  reportingDeviceIds: string[];

  @Column({ name: "metadata", type: "jsonb", default: {} })
  metadata: Record<string, any>;

  @Column({ name: "reason", nullable: true })
  reason?: string;

  toString() {
    return JSON.stringify(this);
  }
}
