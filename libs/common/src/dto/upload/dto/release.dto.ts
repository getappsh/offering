import { ProjectType, ReleaseEntity, ReleaseStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsSemVer, IsString, IsBoolean} from "class-validator";
import { ReleaseArtifactDto } from "./release-artifact.dto";
import { Type } from "class-transformer";
import { ProjectIdentifierParams } from "@app/common/dto/project-management";

export class SetReleaseDto {
  
  projectIdentifier: string | number

  projectId: number
  
  @ApiProperty()
  @IsSemVer()
  version: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  releaseNotes?: string;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isDraft?: boolean = true;

  @ApiProperty({ required: false, type: String, isArray: true , description: 'List of dependencies. Providing an empty array will remove all dependencies. Omitting this field or setting it to null will leave dependencies unchanged.' })
  @IsOptional()
  @IsString({each: true})
  @IsNotEmpty({each: true})
  dependencies?: string[]

  toString(){
    return JSON.stringify(this)
  }

}

export class ReleaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  projectName: string;
  
  @ApiProperty({ required: false })
  projectId?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  releaseNotes: string;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty({ type: 'enum', enum: ReleaseStatusEnum })
  status: ReleaseStatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Total number of required regulations' })
  requiredRegulationsCount: number;

  @ApiProperty({ description: 'Total number of compliant regulations' })
  compliantRegulationsCount: number;

  @ApiProperty()
  latest: boolean

  @ApiProperty({required: false})
  releasedAt?: Date

  static fromEntity(release: ReleaseEntity): ReleaseDto {
    const dto = new ReleaseDto();
    dto.version = release.version;
    dto.id = release.catalogId;
    dto.projectId = release?.project?.id;
    dto.projectName = release?.project?.name;
    dto.name = release.name;
    dto.releaseNotes = release.releaseNotes;
    dto.metadata = release.metadata;
    dto.status = release.status;
    dto.createdAt = release.createdAt;
    dto.updatedAt = release.updatedAt;
    dto.requiredRegulationsCount = release.requiredRegulationsCount;
    dto.compliantRegulationsCount = release.compliantRegulationsCount;
    dto.latest = release.latest;
    dto.releasedAt = release.releasedAt;

    return dto;
  }

  toString(){
    return JSON.stringify(this)
  }
}

export class DetailedReleaseDto extends ReleaseDto {

  @ApiProperty({ type: ReleaseArtifactDto, isArray: true, required: false })
  artifacts?: ReleaseArtifactDto[];

  @ApiProperty({type: ReleaseDto, isArray: true, required: false})
  dependencies: ReleaseDto[]


  static fromEntity(release: ReleaseEntity): DetailedReleaseDto {
    const baseDto = super.fromEntity(release);
    const dto = new DetailedReleaseDto();

    Object.assign(dto, baseDto);

    dto.artifacts = release?.artifacts?.map(art => ReleaseArtifactDto.fromEntity(art))
    dto.dependencies = release?.dependencies?.map(dep => ReleaseDto.fromEntity(dep))

    return dto

  }
}

export class ComponentV2Dto{
  @ApiProperty()
  id: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  projectName: string;

  @ApiProperty({required: false})
  releaseNotes?: string;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty({ type: 'enum', enum: ReleaseStatusEnum })
  status: ReleaseStatusEnum;

  @ApiProperty({ type: 'enum', enum: ProjectType })
  type: ProjectType

  @ApiProperty({type: 'integer', format: 'int64', required: false})
  size: number

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({required: false})
  latest?: boolean

  @ApiProperty({required: false})
  releasedAt?: Date

  static fromEntity(release: ReleaseEntity): ComponentV2Dto {
    const dto = new ComponentV2Dto();
    dto.version = release.version;
    dto.id = release.catalogId;
    dto.releaseNotes = release.releaseNotes;
    dto.metadata = release.metadata;
    dto.status = release.status;
    dto.createdAt = release.createdAt;
    dto.updatedAt = release.updatedAt;
    dto.projectName = release.project.name;
    dto.type = release.project.projectType;
    dto.latest = release.latest;
    dto.releasedAt = release.releasedAt;
    dto.size = release?.artifacts
      ?.filter(a => a.isInstallationFile)
      ?.map(a => a?.fileUpload?.size)
      ?.reduce((size, a) => size + a, 0);
    return dto;
  }
  
  toString(){
    return JSON.stringify(this)
  }
}

export class ReleaseParams extends ProjectIdentifierParams{
  @ApiProperty()
  @IsSemVer()
  @Type(() => String)
  version: string

  constructor(projectId: number, version: string) {
    super()
    this.projectId = projectId;
    this.version = version;
  }
}
