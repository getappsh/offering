import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RuleType } from '../enums/rule.enums';

export class ReleaseIdentifierDto {
  @ApiPropertyOptional({ description: 'Project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ description: 'Release version' })
  @IsString()
  @IsNotEmpty()
  version: string;
}

export class PolicyAssociationDto {
  @ApiProperty({ type: [ReleaseIdentifierDto], description: 'Releases for this policy' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReleaseIdentifierDto)
  releases: ReleaseIdentifierDto[];
}

export class RestrictionAssociationDto {
  @ApiPropertyOptional({ type: [String], description: 'Device type names for restrictions' })
  @IsOptional()
  @IsString({ each: true })
  deviceTypeNames?: string[];

  @ApiPropertyOptional({ type: [String], description: 'OS types for restrictions' })
  @IsOptional()
  @IsString({ each: true })
  osTypes?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Specific device IDs for restrictions' })
  @IsOptional()
  @IsString({ each: true })
  deviceIds?: string[];
}

export class CreatePolicyDto {
  @ApiProperty({ description: 'Policy name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Policy description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: PolicyAssociationDto, description: 'Policy associations' })
  @ValidateNested()
  @Type(() => PolicyAssociationDto)
  association: PolicyAssociationDto;

  @ApiPropertyOptional({ description: 'Whether the policy is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: 'object', description: 'Rule engine compliant rule object' })
  @IsObject()
  @IsNotEmpty()
  rule: any;
}

export class CreateRestrictionDto {
  @ApiProperty({ description: 'Restriction name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Restriction description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: RestrictionAssociationDto, description: 'Restriction associations' })
  @ValidateNested()
  @Type(() => RestrictionAssociationDto)
  association: RestrictionAssociationDto;

  @ApiPropertyOptional({ description: 'Whether the restriction is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: 'object', description: 'Rule engine compliant rule object' })
  @IsObject()
  @IsNotEmpty()
  rule: any;
}

// Generic DTO that combines both for internal use
export class RuleAssociationDto {
  @ApiPropertyOptional({ type: [ReleaseIdentifierDto], description: 'Releases for policies' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReleaseIdentifierDto)
  releases?: ReleaseIdentifierDto[];

  @ApiPropertyOptional({ type: [String], description: 'Device type names for restrictions' })
  @IsOptional()
  @IsString({ each: true })
  deviceTypeNames?: string[];

  @ApiPropertyOptional({ type: [String], description: 'OS types for restrictions' })
  @IsOptional()
  @IsString({ each: true })
  osTypes?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Specific device IDs for restrictions' })
  @IsOptional()
  @IsString({ each: true })
  deviceIds?: string[];
}

export class CreateRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RuleType, description: 'Rule type (policy or restriction)' })
  @IsEnum(RuleType)
  type: RuleType;

  @ApiProperty({ type: RuleAssociationDto, description: 'Rule associations' })
  @ValidateNested()
  @Type(() => RuleAssociationDto)
  association: RuleAssociationDto;

  @ApiPropertyOptional({ description: 'Whether the rule is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: 'object', description: 'Rule engine compliant rule object' })
  @IsObject()
  @IsNotEmpty()
  rule: any;
}
