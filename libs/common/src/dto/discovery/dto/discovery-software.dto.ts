import { UploadVersionEntity } from "@app/common/database/entities";
import { IsValidStringFor } from "@app/common/validators";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class ComponentDto {

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({required: false})
  @IsString()
  name: string;

  @ApiProperty({required: false})
  @IsNotEmpty()
  @IsValidStringFor("version")
  versionNumber: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  releaseNotes: string;

  @ApiProperty({required: false})
  @IsNumber()
  @IsOptional()
  virtualSize: number;

  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({required: false})
  @IsValidStringFor("version")
  @IsOptional()
  baseVersion: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsValidStringFor("version")
  prevVersion: string;

  @ApiProperty({required: false, type: [ComponentDto]})
  @IsOptional()
  @ValidateNested({each:true})
  @IsArray()
  @Type(() => ComponentDto)
  subComponents: ComponentDto[]

  static fromUploadVersionEntity(entity: UploadVersionEntity){
    const comp = new ComponentDto()
    comp.name = entity.component;
    comp.versionNumber = entity.version;
    comp.baseVersion = entity.baseVersion || undefined;
    comp.prevVersion = entity.prevVersion || undefined;
    comp.catalogId = entity.catalogId;
    
    comp.virtualSize = entity.virtualSize;
    
    comp.category = entity.metadata?.category;
    comp.releaseNotes = entity.metadata?.releaseNote;

    return comp
  }

  toString() {
    return JSON.stringify(this)
  }
}


export class PlatformDto {

  @ApiProperty({required: false})
  @IsString()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  platformNumber: string;

  @ApiProperty({required: false})
  @IsNumber()
  virtualSize: number;

  @ApiProperty({required: false, type: [ComponentDto]})
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => ComponentDto)
  components: ComponentDto[]
}


export class DiscoverySoftwareDto {
  @ApiProperty({required: false})
  @IsNotEmpty()
  formation: string

  @ApiProperty({required: false, type: PlatformDto})
  @ValidateNested()
  @Type(() => PlatformDto)
  platform: PlatformDto;
}