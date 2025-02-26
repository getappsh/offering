import { ArtifactTypeEnum, FileUPloadStatusEnum, ReleaseArtifactEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber, IsSemVer } from "class-validator";
import { ProjectIdentifierParams } from "../../project-management";

export class SetReleaseArtifactDto {

  projectIdentifier: string | number

  version: string

  projectId: number


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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

}


export class SetReleaseArtifactResDto {

  @ApiProperty()
  artifactId: number

  @ApiProperty({ required: false, description: 'Only present for FILE artifact type' })
  uploadUrl: string;


  toString(){
    return JSON.stringify(this)
  }
}

export class GetReleaseArtifactResDto {

  @ApiProperty()
  artifactId: number

  @ApiProperty({ required: false, description: 'Only present for FILE artifact type' })
  downloadUrl?: string;

  toString(){
    return JSON.stringify(this)
  }

}


export class ReleaseArtifactDto {

  @ApiProperty()
  id: number

  @ApiProperty()
  artifactName: string

  @ApiProperty()
  type: ArtifactTypeEnum

  @ApiProperty()
  metadata: Record<string, any>

  @ApiProperty()
  isInstallationFile: boolean

  @ApiProperty({required: false })
  dockerImageUrl?: string

  @ApiProperty()
  uploadId: number

  @ApiProperty({type: 'enum', enum: FileUPloadStatusEnum, required: false})
  status?: FileUPloadStatusEnum

  @ApiProperty({required: false, type: 'integer', format: 'int64'})
  size?: number


  static fromEntity(artifact: ReleaseArtifactEntity): ReleaseArtifactDto {
    const dto = new ReleaseArtifactDto();
    dto.id = artifact.id;
    dto.artifactName = artifact.artifactName;
    dto.type = artifact.type;
    dto.metadata = artifact.metadata;
    dto.isInstallationFile = artifact.isInstallationFile;
    dto.dockerImageUrl = artifact?.dockerImageUrl;
    dto.uploadId = artifact.fileUpload ? artifact.fileUpload.id : null;
    dto.status = artifact?.fileUpload?.status
    dto.size = artifact?.fileUpload?.size
    
    return dto
  }

  toString(){
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