import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class DeviceFieldDto {
  @ApiProperty({ description: 'Field name in JSONPath format (e.g., $.battery.level)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Field data type (number, string, boolean)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ description: 'Human-readable label for the field' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ description: 'Field description' })
  @IsOptional()
  @IsString()
  description?: string;
}
