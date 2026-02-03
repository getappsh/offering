import { IsOptional, IsBoolean, IsNumber, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RuleType } from '../enums/rule.enums';

export class PolicyQueryDto {
  @ApiPropertyOptional({ description: 'Project identifier (ID or name)' })
  @IsOptional()
  projectIdentifier?: string | number;

  @ApiPropertyOptional({ description: 'Filter by rule type', enum: RuleType })
  @IsOptional()
  @IsEnum(RuleType)
  type?: RuleType;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by release catalog ID' })
  @IsOptional()
  @IsString()
  releaseId?: string;

  @ApiPropertyOptional({ description: 'Filter by device type ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deviceTypeId?: number;

  @ApiPropertyOptional({ description: 'Filter by device ID' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Filter by OS type' })
  @IsOptional()
  @IsString()
  osType?: string;
}
