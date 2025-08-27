import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DeviceEntity } from "./device.entity";
import { FileUploadEntity } from "./file-upload.entity";



@Entity("log_report")
export class BugReportEntity extends BaseEntity{


  @Column({name: 'description', default: null})
  description: string

  @Column({name: 'agent_version'})
  agentVersion: string

  @ManyToOne(() => DeviceEntity, {nullable: false, onDelete: 'CASCADE'})
  @JoinColumn({})
  device: DeviceEntity
  
  @Column({ name: "start_date", type: 'timestamptz', nullable: true })
  startDate?: Date; 

  @Column({  name: "end_date", type: 'timestamptz', nullable: true  })
  endDate?: Date;  

  @Column({ name: "log_level", length: 20 , nullable: true })
  logLevel?: string;

  @ManyToOne(() => FileUploadEntity, { nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({ name: "file_upload_object_key", referencedColumnName: "objectKey" })
  fileUpload?: FileUploadEntity;

  
  toString(){
    return JSON.stringify(this);
  }
}
