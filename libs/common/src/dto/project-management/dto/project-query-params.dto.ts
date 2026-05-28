import { ProjectType } from '@app/common/database/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetProjectsQueryDto {
  @ApiProperty({
    description: 'If true, include only pinned projects',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  pinned?: boolean;

  @ApiProperty({
    description: 'Include pinned projects along with regular projects',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  includePinned?: boolean;

  @ApiProperty({
    description: 'The page number to fetch (default: 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of projects per page (default: 15)',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage?: number = 15;

  @ApiProperty({
    description: 'Filter by specific project names',
    example: ['project1', 'project2'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  projectNames?: string[];

  @ApiPropertyOptional({
    description: 'If true, return only archived projects; if false (default), return only active (non-archived) projects',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  archived?: boolean;

  @ApiProperty({
    description: 'Filter by specific project types. When not provided, config and config_map types are excluded by default.',
    example: ['application', 'lib'],
    enum: ProjectType,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  projectTypes?: ProjectType[];
 
}


export class SearchProjectsQueryDto {
  @ApiProperty({
    description: 'The search term (matches project name or partial match)',
    required: false
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  query: string;

  @ApiProperty({
    description: 'Filter by project status (active, completed, on-hold)',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  status?: string;


  @ApiProperty({
    description: 'Include projects not owned or associated with the user',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeUnassociated?: boolean = false;

  @ApiProperty({
    description: 'The page number to fetch (default: 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of projects per page (default: 15)',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage?: number = 10;

  @ApiProperty({
    description: 'Filter by specific project types. When not provided, config and config_map types are excluded by default.',
    example: ['application', 'lib'],
    enum: ProjectType,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  projectTypes?: ProjectType[];
}