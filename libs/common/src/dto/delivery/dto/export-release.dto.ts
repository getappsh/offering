import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExportArtifactDto {
  @ApiProperty({ description: 'Artifact file name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'File size in bytes', type: 'integer', format: 'int64' })
  size: number;

  @ApiProperty({ description: 'SHA256 hash for integrity verification' })
  @IsString()
  @IsNotEmpty()
  sha256: string;

  @ApiProperty({ description: 'Download URL for the artifact' })
  @IsString()
  @IsNotEmpty()
  downloadUrl: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ExportDockerImageDto {
  @ApiProperty({ description: 'Docker image name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Docker image URL' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;


  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ExportDependencyDto {
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

export class ExportReleaseDto {
  @ApiProperty({ description: 'Release name' })
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @ApiProperty({ description: 'Project identifier' })
  @IsString()
  @IsNotEmpty()
  project: string;

  @ApiProperty({ description: 'Release status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Release notes', required: false })
  @IsString()
  @IsOptional()
  releaseNotes?: string;

  @ApiProperty({ description: 'Author email' })
  @IsEmail()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'Release metadata' })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'List of artifacts', type: [ExportArtifactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExportArtifactDto)
  artifacts: ExportArtifactDto[];

  @ApiProperty({ description: 'List of docker images', type: [ExportDockerImageDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExportDockerImageDto)
  dockerImages?: ExportDockerImageDto[];

  @ApiProperty({ description: 'List of dependencies', type: [ExportDependencyDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExportDependencyDto)
  dependencies?: ExportDependencyDto[];
}
