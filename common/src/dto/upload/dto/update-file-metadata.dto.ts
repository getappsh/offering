import { ApiProperty } from "@nestjs/swagger";
import { 
  IsBoolean, 
  IsNumber, 
  IsOptional, 
  IsString, 
} from "class-validator";



export class UpdateFilePropertiesDto {


  projectIdentifier: string | number

  version: string

  projectId: number

  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  arguments?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsBoolean()
  isExecutable?: boolean;

  @ApiProperty({required: false})
  @IsOptional()
  @IsBoolean()
  isInstallationFile?: boolean;

  @ApiProperty({required: false})
  @IsOptional()
  metadata?: Record<string, any>;
}
