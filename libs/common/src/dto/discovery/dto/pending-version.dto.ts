import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PendingVersionStatus, PendingVersionEntity } from "@app/common/database/entities/pending-version.entity";
import { Type } from "class-transformer";

export class PendingVersionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectName: string;

  @ApiProperty()
  version: string;

  @ApiProperty({ required: false })
  catalogId?: string;

  @ApiProperty({ enum: PendingVersionStatus })
  status: PendingVersionStatus;

  @ApiProperty()
  reportedCount: number;

  @ApiProperty()
  firstReportedDate: Date;

  @ApiProperty()
  lastReportedDate: Date;

  @ApiProperty({ type: [String] })
  reportingDeviceIds: string[];

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty({ required: false })
  reason?: string;
}

export class PendingVersionListDto {
  @ApiProperty({ type: [PendingVersionDto] })
  versions: PendingVersionDto[];

  @ApiProperty()
  total: number;
}

export class ListPendingVersionsQueryDto {
  @ApiProperty({ enum: PendingVersionStatus, required: false })
  @IsOptional()
  @IsEnum(PendingVersionStatus)
  status?: PendingVersionStatus;

  @ApiProperty({ required: false, default: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 100;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number = 0;
}

export class AcceptPendingVersionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  version: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false, description: 'Username of the user accepting the version. Populated from auth token.' })
  @IsOptional()
  @IsString()
  username?: string;
}

export class RejectPendingVersionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  version: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateProjectVersionDto {
  @ApiProperty()
  projectName: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  isDraft: boolean;

  @ApiProperty({ required: false })
  reason?: string;
}

/**
 * Convert PendingVersionEntity to PendingVersionDto
 */
export function toPendingVersionDto(entity: PendingVersionEntity): PendingVersionDto {
  return {
    id: entity.id,
    projectName: entity.projectName,
    version: entity.version,
    catalogId: entity.catalogId,
    status: entity.status,
    reportedCount: entity.reportedCount,
    firstReportedDate: entity.firstReportedDate,
    lastReportedDate: entity.lastReportedDate,
    reportingDeviceIds: entity.reportingDeviceIds,
    metadata: entity.metadata,
    reason: entity.reason
  };
}
