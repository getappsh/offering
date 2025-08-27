import { UploadStatus, UploadVersionEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";

export class ProjectReleasesDto {

  @ApiProperty({required: false})
  catalogId: string;

  @ApiProperty({required: false})
  name: string;

  @ApiProperty({required: false})
  platform: string;

  @ApiProperty({required: false})
  formation: string;

  @ApiProperty({required: false})
  version: string;

  @ApiProperty({required: false})
  releaseNotes: string;

  @ApiProperty({required: false})
  virtualSize: number;

  @ApiProperty({required: false})
  category: string;

  @ApiProperty({enum: UploadStatus})
  uploadStatus: string
  
  @ApiProperty({required: false})
  deploymentStatus: string
  
  @ApiProperty({required: false})
  securityStatus: string
  
  @ApiProperty({required: false})
  policyStatus: string


  formUploadEntity(upload: UploadVersionEntity){
    this.catalogId = upload.catalogId;
    this.name = upload.component;
    this.platform = upload.platform;
    this.formation = upload.formation;
    this.version = upload.version
    this.releaseNotes = upload.metadata?.releaseNote;
    this.virtualSize = upload.virtualSize;
    this.uploadStatus = upload.uploadStatus;
    this.deploymentStatus = upload.deploymentStatus;
    this.securityStatus = upload.securityStatus;
    this.policyStatus = upload.policyStatus;

    return this
  }

  toString() {
    return JSON.stringify(this)
  }
}