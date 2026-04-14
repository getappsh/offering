import { IsOptional, IsUUID, ValidateIf, IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EvaluateRuleDto {
  @ApiPropertyOptional({ description: 'ID of an existing rule to evaluate. Supply either this or `rule`.' })
  @IsOptional()
  @IsUUID()
  ruleId?: string;

  @ApiPropertyOptional({ description: 'Inline rule JSON (rule-engine format). Supply either this or `ruleId`.' })
  @ValidateIf(o => !o.ruleId)
  @IsNotEmpty({ message: 'Either ruleId or rule must be provided' })
  rule?: any;
}

export class EvaluatedDeviceDto {
  @ApiProperty({ description: 'Unique device identifier' })
  deviceId: string;

  @ApiPropertyOptional({ description: 'Human-readable device name' })
  deviceName?: string;

  @ApiPropertyOptional({ description: 'Operating system of the device' })
  os?: string;

  @ApiPropertyOptional({ description: 'IP address of the device' })
  ip?: string;

  @ApiPropertyOptional({ description: 'MAC address of the device' })
  mac?: string;

  @ApiPropertyOptional({ description: 'Serial number of the device' })
  serialNumber?: string;

  @ApiPropertyOptional({ description: 'Platform name the device belongs to' })
  platformName?: string;

  @ApiPropertyOptional({ description: 'Device type names assigned to the device', type: [String] })
  deviceTypeNames?: string[];

  @ApiPropertyOptional({ description: 'Names of the groups the device belongs to', type: [String] })
  groupNames?: string[];

  @ApiPropertyOptional({ description: 'ID of the discovery message used to build the evaluation context for this device' })
  discoveryMessageId?: string;
}

export class AttachedReleaseDto {
  @ApiPropertyOptional({ description: 'Catalog ID of the release' })
  catalogId?: string;

  @ApiPropertyOptional({ description: 'Version string of the release' })
  version?: string;

  @ApiPropertyOptional({ description: 'Project ID the release belongs to' })
  projectId?: string;

  @ApiPropertyOptional({ description: 'Project name the release belongs to' })
  projectName?: string;
}

export class EvaluateRuleResultDto {
  @ApiProperty({ description: 'Devices whose latest discovery data matched the rule', type: [EvaluatedDeviceDto] })
  matchingDevices: EvaluatedDeviceDto[];

  @ApiProperty({ description: 'Total number of devices evaluated' })
  totalDevicesEvaluated: number;

  @ApiProperty({ description: 'Number of devices that matched the rule' })
  matchingCount: number;

  @ApiPropertyOptional({ description: 'Releases the policy is attached to (only present for saved policy rules)', type: [AttachedReleaseDto] })
  attachedReleases?: AttachedReleaseDto[];
}

export class GetDeviceContextDto {
  @ApiPropertyOptional({ description: 'Device ID to look up. Required when discoveryMessageId is not provided.' })
  @ValidateIf(o => !o.discoveryMessageId)
  @IsNotEmpty({ message: 'Either deviceId or discoveryMessageId must be provided' })
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'ID of a specific discovery message to use. When provided, deviceId is not required.' })
  @ValidateIf(o => !o.deviceId)
  @IsNotEmpty({ message: 'Either deviceId or discoveryMessageId must be provided' })
  @IsNumberString()
  @IsOptional()
  discoveryMessageId?: string;
}

export class DeviceContextDto {
  @ApiProperty({ description: 'ID of the discovery message used to build this context' })
  discoveryMessageId: string;

  @ApiProperty({ description: 'The device evaluation context as used during rule evaluation' })
  context: Record<string, any>;
}

/** @deprecated use EvaluateRuleResultDto */
export type EvaluateRestrictionResultDto = EvaluateRuleResultDto;
