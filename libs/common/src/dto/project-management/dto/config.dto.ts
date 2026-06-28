import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';
import { ConfigRevisionStatus } from '@app/common/database/entities';

// ---------------------------------------------------------------------------
// Group DTOs
// ---------------------------------------------------------------------------

export class ConfigGroupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, description: 'Optional human-readable display name. Falls back to name when not set.' })
  displayName: string | null;

  @ApiProperty()
  isGlobal: boolean;

  @ApiProperty({ required: false })
  gitFilePath: string | null;

  @ApiProperty({
    type: [String],
    description: 'Dot-notation key paths whose values are sensitive (e.g. ["password", "credentials.token"]). Values at these paths are masked as *** in API responses.',
  })
  sensitiveKeys: string[];

  @ApiProperty({
    required: false,
    description: 'The group configuration as a complete YAML string. Values at sensitiveKeys paths are masked as ***.',
  })
  yamlContent: string | null;
}

export class UpsertConfigGroupDto {
  projectIdentifier: number | string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'Optional human-readable display name. Falls back to name when not set.' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gitFilePath?: string;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Dot-notation key paths to treat as sensitive (e.g. ["password", "db.password"]). Replaces the previous list.',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sensitiveKeys?: string[];

  @ApiProperty({
    required: false,
    description:
      'Complete YAML string for the group. Replaces existing content. ' +
      'Sensitive keys (listed in `sensitiveKeys`) will be encrypted and stored in Vault. ' +
      'When reading back a group the API masks those values as `***`. ' +
      'If you submit `***` as the value for a sensitive key, the existing secret is preserved — ' +
      'you do not need to re-supply the original plaintext value.',
    example: 'host: db.internal\nport: 5432\npassword: "***"',
  })
  @IsString()
  @IsOptional()
  yamlContent?: string;
}

export class DeleteConfigGroupDto {
  projectIdentifier: number | string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  groupName: string;
}

// ---------------------------------------------------------------------------
// Revision DTOs
// ---------------------------------------------------------------------------

export class ConfigRevisionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  revisionNumber: number;

  @ApiProperty({ enum: ConfigRevisionStatus })
  status: ConfigRevisionStatus;

  @ApiProperty({ required: false })
  appliedBy: string | null;

  @ApiProperty({ required: false })
  appliedAt: Date | null;

  @ApiProperty({ required: false, description: 'Semantic version (e.g. "1.2.0") assigned when the revision was promoted to ACTIVE. Null for draft revisions.' })
  semVer: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [ConfigGroupDto], required: false })
  groups?: ConfigGroupDto[];
}

export class ApplyConfigRevisionDto {
  projectIdentifier: number | string;

  @ApiProperty({ required: false, description: 'Who is applying (email / user id)' })
  @IsString()
  @IsOptional()
  appliedBy?: string;
}

export class GetConfigRevisionsQueryDto {
  @ApiProperty({ required: false, description: 'Include groups in each revision' })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeGroups?: boolean;
}

export class GetConfigRevisionQueryDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  includeGroups?: boolean;
}

export class CreateDraftRevisionDto {
  @ApiProperty({ description: 'Project identifier (id or name)' })
  @IsNotEmpty()
  projectIdentifier: number | string;
}

export class DeleteDraftRevisionDto {
  @ApiProperty({ description: 'Project identifier (id or name)' })
  @IsNotEmpty()
  projectIdentifier: number | string;
}

export class GetConfigRevisionsDto {
  @ApiProperty({ description: 'Project identifier (id or name)' })
  @IsNotEmpty()
  projectIdentifier: number | string;

  /** When true, include groups and entries in each revision */
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  includeGroups?: boolean;
}

export class GetConfigRevisionByIdDto {
  @ApiProperty()
  @IsInt()
  revisionId: number;

  /** When true, include groups and entries */
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  includeGroups?: boolean;
}

// ---------------------------------------------------------------------------
// ConfigMap Association DTOs
// ---------------------------------------------------------------------------

export class ConfigMapAssociationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  configMapProjectId: number;

  @ApiProperty({ required: false })
  deviceTypeId: number | null;

  @ApiProperty({ required: false, description: 'Specific device ID this association targets, or null for device-type / global rules' })
  deviceId: string | null;

  @ApiProperty({ required: false, description: 'Direct link to a specific CONFIG project, or null for device-type / device-id / global rules' })
  configProjectId: number | null;
}

export class AddConfigMapAssociationDto {
 
  configMapProjectIdentifier: number | string;

  @ApiProperty({ required: false, description: 'Device type ID to associate with. Null = global.' })
  @IsInt()
  @IsOptional()
  deviceTypeId?: number;

  @ApiProperty({ required: false, description: 'Array of device IDs to associate with directly.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  deviceIds?: string[];
}

export class RemoveConfigMapAssociationDto {
  @ApiProperty()
  @IsInt()
  associationId: number;
}

export class GetConfigMapAssociationsDto {
  @ApiProperty({ description: 'ConfigMap project identifier (id or name)' })
  @IsNotEmpty()
  configMapProjectIdentifier: number | string;
}

/** A ConfigMap project that references a given CONFIG project's device type */
export class ConfigMapForProjectDto {
  @ApiProperty({ description: 'ConfigMap project ID' })
  configMapProjectId: number;

  @ApiProperty({ description: 'ConfigMap project name' })
  configMapProjectName: string;

  @ApiProperty({ description: 'Association ID' })
  associationId: number;

  @ApiProperty({ description: 'Device type ID matched, or null for global associations', required: false })
  deviceTypeId: number | null;
}

export class GetConfigMapsForProjectDto {
  @ApiProperty({ description: 'CONFIG project identifier (id or name)' })
  @IsNotEmpty()
  projectIdentifier: number | string;
}

export class ConfigMapAffectedDeviceDto {
  @ApiProperty({ description: 'Device ID affected by the config map' })
  deviceId: string;

  @ApiProperty({ description: 'How the device was associated', enum: ['deviceType', 'deviceId'] })
  associationType: 'deviceType' | 'deviceId';

  @ApiProperty({ description: 'The value of the association (device type ID or device ID)' })
  associationValue: string;
}

// ---------------------------------------------------------------------------
// Agent / device config retrieval
// ---------------------------------------------------------------------------

/** Parsed content of a single merged group. Supports nested objects from YAML. */
export type ConfigGroupValuesMap = Record<string, any>;

/** The final assembled config returned to the agent. */
export class DeviceConfigDto {
  @ApiProperty({ description: 'Device ID this config belongs to' })
  deviceId: string;

  @ApiProperty({ description: 'Revision ID of the device config project used' })
  configRevisionId: number | null;

  @ApiProperty({ required: false, description: 'Semantic version of the active revision when this config was assembled' })
  semVer: string | null;

  /** Group name → parsed YAML content. Supports complex nested objects. Sensitive groups are always resolved. */
  @ApiProperty({ description: 'Assembled config groups keyed by group name' })
  groups: Record<string, ConfigGroupValuesMap>;

  /** ISO timestamp of when this config was last computed */
  @ApiProperty()
  computedAt: string;
}

export class GetDeviceConfigByVersionDto {
  @ApiProperty({ description: 'Device ID' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ description: 'Semantic version of the revision to retrieve (e.g. "1.2.0")' })
  @IsString()
  @IsNotEmpty()
  semver: string;

  /**
   * When true (default) vault secrets are resolved to plaintext.
   * Set to false to retrieve raw (vault-ref) values.
   */
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  resolveSecrets?: boolean;
}

export class GetDeviceConfigDto {
  @ApiProperty({ description: 'Device ID' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  /**
   * When true (default when called by agent) vault secrets are resolved.
   * Set to false to get the config without secret values (for caching).
   */
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  resolveSecrets?: boolean;
}

// ---------------------------------------------------------------------------
// GitOps config group sync
// ---------------------------------------------------------------------------

export class GitConfigGroupDto {
  @ApiProperty({ description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'Path to a YAML file in the git repo whose key-values populate this group' })
  @IsString()
  @IsOptional()
  gitFilePath?: string;

  @ApiProperty({ required: false, description: 'When true this is the globals group' })
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;
}
