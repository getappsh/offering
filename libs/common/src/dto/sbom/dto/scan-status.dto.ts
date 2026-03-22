import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ScanStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

export enum SbomTargetType {
  DOCKER_IMAGE = 'docker',
  REGISTRY = 'registry',
  FILE = 'file',
  DIR = 'dir',
  OCI_ARCHIVE = 'oci-archive',
}

export enum SbomFormat {
  SYFT_JSON = 'syft-json',
  SPDX_JSON = 'spdx-json',
  CYCLONEDX_JSON = 'cyclonedx-json',
  TABLE = 'table',
  TEXT = 'text',
}

export class ScanStatusResponseDto {
  @ApiProperty({ description: 'Scan job UUID' })
  id: string;

  @ApiProperty({ enum: ScanStatus, description: 'Current status of the scan' })
  status: ScanStatus;

  @ApiProperty({ description: 'Scan target (image name, file path, registry URL, etc.)' })
  target: string;

  @ApiProperty({ enum: SbomTargetType, description: 'Type of the scan target' })
  targetType: SbomTargetType;

  @ApiProperty({ enum: SbomFormat, description: 'SBOM output format' })
  format: SbomFormat;

  @ApiPropertyOptional({ description: 'Who or what triggered this scan' })
  triggeredBy?: string;

  @ApiPropertyOptional({ description: 'Error message if the scan failed' })
  error?: string;

  @ApiPropertyOptional({ description: 'Short reason code for the failure' })
  failureReason?: string;

  @ApiProperty({ description: 'Timestamp when the scan was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of the last status update' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Timestamp when the scan reached a terminal state' })
  completedAt?: Date;
}
