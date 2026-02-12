import { IsOptional, IsBoolean, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RuleType } from '../enums/rule.enums';

export class RestrictionQueryDto {
  @ApiPropertyOptional({ description: 'Project identifier (ID or name)' })
  @IsOptional()
  projectIdentifier?: string | number;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by device type name' })
  @IsOptional()
  @IsString()
  deviceTypeName?: string;

  @ApiPropertyOptional({ description: 'Filter by device ID' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Filter by OS type' })
  @IsOptional()
  @IsString()
  osType?: string;

  @ApiPropertyOptional({ description: 'Rule type filter', enum: RuleType })
  @IsOptional()
  @IsEnum(RuleType)
  type?: RuleType;
}
