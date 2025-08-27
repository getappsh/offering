import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "cron_job_time_management" })
@Unique("start_time_job_name_unique_constraint", ["startTime", "name"])
export class JobsEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "job_name"})
  name: string

  @Column({ name: "start_time", type: "timestamptz", precision: 0 })
  startTime: Date

  @Column({ name: "end_time", type: "timestamptz", precision: 0, nullable: true })
  endTime: Date
}