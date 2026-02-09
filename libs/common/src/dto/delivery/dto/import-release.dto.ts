import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportArtifactDto {
  @ApiProperty({ description: 'Artifact file name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Platform for the artifact (e.g., linux, macos, windows)', required: false })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiProperty({ description: 'File size in bytes', type: 'integer', format: 'int64' })
  size: number;

  @ApiProperty({ description: 'SHA256 hash for integrity verification' })
  @IsOptional()
  @IsString()
  sha256: string;

  @ApiProperty({ description: 'Download URL for the artifact (can be external or internal)' })
  @IsOptional()
  @IsString()
  downloadUrl: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ImportDockerImageDto {
  @ApiProperty({ description: 'Docker image name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Docker image URL' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'Platform for the docker image', required: false })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ImportDependencyDto {
  @ApiProperty({ description: 'Dependency catalog ID' })
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({ description: 'Dependency name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Dependency version' })
  @IsString()
  @IsNotEmpty()
  version: string;
}

export class ImportReleaseDto {
  @ApiProperty({ description: 'Release name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Release version' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ description: 'Release tag', required: false })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ description: 'Project identifier (name or ID)' })
  @IsString()
  @IsNotEmpty()
  project: string;

  @ApiProperty({ description: 'Project ID (set by API layer)', required: false })
  @IsOptional()
  projectIdentifier?: number | string;

  @ApiProperty({ description: 'Release status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Release notes', required: false })
  @IsString()
  @IsOptional()
  releaseNotes?: string;

  @ApiProperty({ description: 'Author email' })
  @IsEmail()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'Release metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'List of artifacts', type: [ImportArtifactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportArtifactDto)
  artifacts: ImportArtifactDto[];

  @ApiProperty({ description: 'List of docker images', type: [ImportDockerImageDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImportDockerImageDto)
  dockerImages?: ImportDockerImageDto[];

  @ApiProperty({ description: 'List of dependencies', type: [ImportDependencyDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImportDependencyDto)
  dependencies?: ImportDependencyDto[];
}

export class ArtifactWarningDto {
  @ApiProperty({ description: 'Artifact name that failed' })
  artifactName: string;

  @ApiProperty({ description: 'Warning message' })
  message: string;

  @ApiProperty({ description: 'Expected SHA256 hash' })
  expectedSha256: string;

  @ApiProperty({ description: 'Actual SHA256 hash', required: false })
  actualSha256?: string;
}

export class ImportReleaseResponseDto {
  @ApiProperty({ description: 'Catalog ID of the created release' })
  catalogId: string;

  @ApiProperty({ description: 'Release name' })
  name: string;

  @ApiProperty({ description: 'Release version' })
  version: string;

  @ApiProperty({ description: 'Release status' })
  status: string;

  @ApiProperty({ description: 'List of warnings for artifacts that failed checksum validation', type: [ArtifactWarningDto], required: false })
  @IsOptional()
  warnings?: ArtifactWarningDto[];

  @ApiProperty({ description: 'Success message' })
  message: string;
}
