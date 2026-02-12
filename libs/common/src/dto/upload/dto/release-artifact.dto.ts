import { ArtifactTypeEnum, FileUPloadStatusEnum, ReleaseArtifactEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber, IsSemVer, NotContains } from "class-validator";
import { ProjectIdentifierParams } from "../../project-management";

export class SetReleaseArtifactDto {

  projectIdentifier: string | number

  version: string

  projectId: number


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ', { message: 'Artifact name cannot contain spaces' })
  artifactName: string

  @ApiProperty({ required: false, type: 'enum', enum: ArtifactTypeEnum, default: ArtifactTypeEnum.FILE })
  @IsOptional()
  @IsEnum(ArtifactTypeEnum)
  type: ArtifactTypeEnum = ArtifactTypeEnum.FILE

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInstallationFile: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dockerImageUrl?: string

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  isExecutable: boolean

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false})
  arguments: string

  

}


export class SetReleaseArtifactResDto {

  @ApiProperty()
  artifactId: number

  @ApiProperty({ required: false, description: 'Only present for FILE artifact type' })
  uploadUrl: string;


  toString() {
    return JSON.stringify(this)
  }
}

export class GetReleaseArtifactResDto {

  @ApiProperty()
  artifactId: number

  @ApiProperty({ required: false, description: 'Only present for FILE artifact type' })
  downloadUrl?: string;

  toString() {
    return JSON.stringify(this)
  }

}


export class ReleaseArtifactDto {

  @ApiProperty()
  id: number

  @ApiProperty()
  artifactName: string

  @ApiProperty({ type: 'enum', enum: ArtifactTypeEnum })
  type: ArtifactTypeEnum

  @ApiProperty()
  metadata: Record<string, any>

  @ApiProperty()
  isInstallationFile: boolean

  @ApiProperty({ required: false })
  dockerImageUrl?: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  isExecutable: boolean

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false})
  arguments?: string | null

  @ApiProperty()
  uploadId?: number

  @ApiProperty({ type: 'enum', enum: FileUPloadStatusEnum, required: false })
  status?: FileUPloadStatusEnum

  @ApiProperty({ required: false, type: 'integer', format: 'int64' })
  size?: number

  @ApiProperty({ 
    required: false, 
    type: 'number', 
    minimum: 0, 
    maximum: 100, 
    description: 'Upload/download progress percentage (0-100). Check status field for errors.' 
  })
  @IsOptional()
  @IsNumber()
  progress?: number

  @ApiProperty({ 
    required: false, 
    type: 'string',
    description: 'Error message when status indicates an error' 
  })
  @IsOptional()
  @IsString()
  error?: string

  @ApiProperty({ required: false, type: 'string', description: 'SHA256 hash of the file' })
  @IsOptional()
  @IsString()
  sha256?: string


  static fromEntity(artifact: ReleaseArtifactEntity): ReleaseArtifactDto {
    const dto = new ReleaseArtifactDto();
    dto.id = artifact.id;
    dto.artifactName = artifact.artifactName ?? "";
    dto.type = artifact.type;
    dto.metadata = artifact.metadata;
    dto.isInstallationFile = artifact.isInstallationFile;
    dto.dockerImageUrl = artifact?.dockerImageUrl;
    dto.uploadId = artifact.fileUpload ? artifact.fileUpload.id : undefined;
    dto.status = artifact?.fileUpload?.status
    dto.size = artifact?.fileUpload?.size
    dto.progress = artifact?.fileUpload?.progress ?? 0
    dto.error = artifact?.fileUpload?.error
    dto.sha256 = artifact?.fileUpload?.sha256
    dto.arguments = artifact?.arguments;
    dto.isExecutable = artifact?.isExecutable;

    return dto
  }

  toString() {
    return JSON.stringify(this)
  }
}


export class ReleaseArtifactParams extends ProjectIdentifierParams {

  @ApiProperty()
  @IsSemVer()
  @Type(() => String)
  version: string

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  artifactId: number
}


export class ReleaseArtifactNameParams extends ProjectIdentifierParams {
  @ApiProperty()
  @IsSemVer()
  @Type(() => String)
  version: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  fileName: string
}