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

  @Column({ nullable: true, type: 'bigint' })
  size?: number
  
  @Column({ name: 'content_type', nullable: true })
  contentType?: string

  @Column({ name: 'upload_at', type: 'timestamptz', nullable: true })
  uploadAt?: Date

  @Column({ name: 'signature', type: 'text', nullable: true})
  signature?: string

  @Column({ name: 'sha256', type: 'text', nullable: true})
  sha256?: string

  @Column({ name: 'progress', type: 'integer', default: 0 })
  progress?: number

  @Column({ name: 'error', type: 'text', nullable: true})
  error?: string

}