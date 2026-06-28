import { IsOptional, IsUUID, ValidateIf, IsNotEmpty, IsNumberString, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluateRuleDto {
  @ApiProperty({ required: false, description: 'ID of an existing rule to evaluate. Supply either this or `rule`.' })
  @IsOptional()
  @IsUUID()
  ruleId?: string;

  @ApiProperty({ required: false, description: 'Inline rule JSON (rule-engine format). Supply either this or `ruleId`.' })
  @ValidateIf(o => !o.ruleId)
  @IsNotEmpty({ message: 'Either ruleId or rule must be provided' })
  rule?: any;

  @ApiProperty({ required: false, description: 'Optional list of device IDs to evaluate. If provided, only these devices are checked; otherwise all devices are evaluated.', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deviceIds?: string[];
}

export class EvaluatedDeviceDto {
  @ApiProperty({ description: 'Unique device identifier' })
  deviceId: string;

  @ApiProperty({ required: false, description: 'Human-readable device name' })
  deviceName?: string;

  @ApiProperty({ required: false, description: 'Operating system of the device' })
  os?: string;

  @ApiProperty({ required: false, description: 'IP address of the device' })
  ip?: string;

  @ApiProperty({ required: false, description: 'MAC address of the device' })
  mac?: string;

  @ApiProperty({ required: false, description: 'Serial number of the device' })
  serialNumber?: string;

  @ApiProperty({ required: false, description: 'Platform name the device belongs to' })
  platformName?: string;

  @ApiProperty({ required: false, description: 'Device type names assigned to the device', type: [String] })
  deviceTypeNames?: string[];

  @ApiProperty({ required: false, description: 'Names of the groups the device belongs to', type: [String] })
  groupNames?: string[];

  @ApiProperty({ required: false, description: 'ID of the discovery message used to build the evaluation context for this device' })
  discoveryMessageId?: string;
}

export class AttachedReleaseDto {
  @ApiProperty({ required: false, description: 'Catalog ID of the release' })
  catalogId?: string;

  @ApiProperty({ required: false, description: 'Version string of the release' })
  version?: string;

  @ApiProperty({ required: false, description: 'Project ID the release belongs to' })
  projectId?: string;

  @ApiProperty({ required: false, description: 'Project name the release belongs to' })
  projectName?: string;
}

export class EvaluateRuleResultDto {
  @ApiProperty({ description: 'Devices whose latest discovery data matched the rule', type: [EvaluatedDeviceDto] })
  matchingDevices: EvaluatedDeviceDto[];

  @ApiProperty({ description: 'Total number of devices evaluated' })
  totalDevicesEvaluated: number;

  @ApiProperty({ description: 'Number of devices that matched the rule' })
  matchingCount: number;

  @ApiProperty({ required: false, description: 'Releases the policy is attached to (only present for saved policy rules)', type: [AttachedReleaseDto] })
  attachedReleases?: AttachedReleaseDto[];
}

export class GetDeviceContextDto {
  @ApiProperty({ required: false, description: 'Device ID to look up. Required when discoveryMessageId is not provided.' })
  @ValidateIf(o => !o.discoveryMessageId)
  @IsNotEmpty({ message: 'Either deviceId or discoveryMessageId must be provided' })
  @IsOptional()
  deviceId?: string;

  @ApiProperty({ required: false, description: 'ID of a specific discovery message to use. When provided, deviceId is not required.' })
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
