import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRuleFieldDto {
  @ApiProperty({ description: 'Field name in JSONPath format (e.g., $.battery.level)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Field data type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Human-readable label' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional({ description: 'Field description' })
  @IsOptional()
  @IsString()
  description?: string;
}
