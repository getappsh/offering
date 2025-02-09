import { Entity, Column, ManyToOne, JoinColumn, OneToOne, Index, Check, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ReleaseEntity } from './release.entity';
import { ArtifactTypeEnum } from './enums.entity';
import { FileUploadEntity } from './file-upload.entity';
import { PlatformEntity } from './platform.entity';

@Entity('release_artifact')

@Index('unique_release_fileupload', ['release', 'fileUpload'], { unique: true, where: "file_upload_id IS NOT NULL and type = 'file'" })
@Index('unique_release_docker_image', ['release', 'dockerImageUrl'], { unique: true, where: "docker_image_url IS NOT NULL and type = 'docker_image'" })
@Check("((file_upload_id IS NOT NULL and type = 'file') OR (docker_image_url IS NOT NULL and type = 'docker_image'))")
export class ReleaseArtifactEntity extends BaseEntity {
  
  @Column({ name: 'artifact_name', nullable: true })
  artifactName?: string;

  @Column({ name: 'type', type: 'enum', enum: ArtifactTypeEnum, default: ArtifactTypeEnum.FILE })
  type: ArtifactTypeEnum;

  @Column({name: 'docker_image_url', default: null, nullable: true })
  dockerImageUrl?: string;

  @Column({name: 'is_installation_file', type: 'boolean', default: false,})
  isInstallationFile: boolean;

  @Column({ name: 'metadata', type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToMany(() => PlatformEntity, { eager: true })
  @JoinTable({
      name: "artifact_platforms",
      joinColumn: { name: "artifact_id", referencedColumnName: "id" },
      inverseJoinColumn: { name: "platform_name", referencedColumnName: "name" },
  })
  platforms: PlatformEntity[];

  @ManyToOne(() => ReleaseEntity, release => release.artifacts, {nullable: false})
  @JoinColumn({ name: 'release_id' })
  release: ReleaseEntity;

  @OneToOne(() => FileUploadEntity, {nullable: true })
  @JoinColumn({ name: 'file_upload_id' })
  fileUpload?: FileUploadEntity;
}