import { ApiProperty } from "@nestjs/swagger";
import { ProjectIdentifierParams } from "./project-identifier.dto";

export enum GitSyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export class GitSyncResultDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty({ enum: GitSyncStatus })
  status: GitSyncStatus;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  version?: string;

  @ApiProperty({ required: false })
  releaseCreated?: boolean;

  @ApiProperty({ required: false })
  error?: string;
}

export class TriggerGitSyncDto extends ProjectIdentifierParams {
  @ApiProperty({ required: false, description: 'Force sync even if recently synced' })
  force?: boolean;
}

export class CheckReleaseExistsDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  version: string;
}

export class CheckReleaseExistsResultDto {
  @ApiProperty()
  exists: boolean;

  @ApiProperty({ required: false })
  releaseId?: string;
}

export class GitSyncCompletedEvent {
  @ApiProperty()
  projectId: number;

  @ApiProperty({ enum: GitSyncStatus })
  status: GitSyncStatus;

  @ApiProperty({ required: false })
  version?: string;

  @ApiProperty({ required: false })
  releaseId?: string;

  @ApiProperty({ required: false })
  error?: string;

  @ApiProperty()
  timestamp: Date;
}
