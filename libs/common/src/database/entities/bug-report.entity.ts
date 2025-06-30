import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DeviceEntity } from "./device.entity";



@Entity("bug_report")
export class BugReportEntity extends BaseEntity{


  @Column({name: 'description', default: null})
  description: string

  @Column({name: 'agent_version'})
  agentVersion: string

  @Column({name: 'logs_path', default: null})
  logsPath: string

  @ManyToOne(() => DeviceEntity, {nullable: false})
  @JoinColumn({})
  device: DeviceEntity

  toString(){
    return JSON.stringify(this);
  }
}
