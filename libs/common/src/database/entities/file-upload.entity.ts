import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileUPloadStatusEnum } from "./enums.entity";

@Entity('file_upload')
export class FileUploadEntity extends BaseEntity{

  @Column({ name: 'file_name' })
  fileName: string

  @Column({ name: 'user_id' })
  userId: string;
  
  @Index({ unique: true })
  @Column({ name: 'object_key' })
  objectKey: string
  
  @Column({ name: 'status', type: 'enum', enum: FileUPloadStatusEnum, default: FileUPloadStatusEnum.PENDING })
  status: FileUPloadStatusEnum

  @Column({ name: 'bucket_name' })
  bucketName: string

  @Column({ nullable: true })
  size?: number
  
  @Column({ name: 'content_type', nullable: true })
  contentType?: string

  @Column({ name: 'upload_at', type: 'timestamptz', nullable: true })
  uploadAt?: Date

}