import { ProjectType } from '@app/common/database/entities';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetProjectsQueryDto {
  @ApiPropertyOptional({
    description: 'If true, include only pinned projects',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  pinned?: boolean;

  @ApiPropertyOptional({
    description: 'Include pinned projects along with regular projects',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  includePinned?: boolean;

  @ApiPropertyOptional({
    description: 'The page number to fetch (default: 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of projects per page (default: 15)',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage?: number = 15;

 
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

  @ApiPropertyOptional({
    description: 'Filter by project status (active, completed, on-hold)',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  status?: string;


  @ApiPropertyOptional({
    description: 'Include projects not owned or associated with the user',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeUnassociated?: boolean = false;

  @ApiPropertyOptional({
    description: 'The page number to fetch (default: 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of projects per page (default: 15)',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage?: number = 10;
}