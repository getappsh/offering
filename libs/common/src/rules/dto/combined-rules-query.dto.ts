import { IsOptional, IsEnum, IsBoolean, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RuleType } from '../enums/rule.enums';

export class CombinedRulesQueryDto {
  @ApiPropertyOptional({ description: 'Project identifier (ID or name)' })
  @IsOptional()
  projectIdentifier?: string | number;

  @ApiPropertyOptional({ enum: RuleType, description: 'Filter by rule type (policy or restriction)' })
  @IsOptional()
  @IsEnum(RuleType)
  type?: RuleType;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  // Fields for policies (release-associated rules)
  @ApiPropertyOptional({ description: 'Filter by release ID (policies only)' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  releaseId?: string;

  // Fields for restrictions (device/os-associated rules)
  @ApiPropertyOptional({ description: 'Filter by device type name (restrictions only)' })
  @IsOptional()
  @IsString()
  deviceTypeName?: string;

  @ApiPropertyOptional({ description: 'Filter by device type ID (restrictions only)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deviceTypeId?: number;

  @ApiPropertyOptional({ description: 'Filter by device ID (restrictions only)' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Filter by OS type (restrictions only)' })
  @IsOptional()
  @IsString()
  osType?: string;
}
