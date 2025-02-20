import { DeviceComponentStateEnum, UploadVersionEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsSemVer, IsString, ValidateNested } from "class-validator";

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
  @IsSemVer()
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
  @IsSemVer()
  @IsOptional()
  baseVersion: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsSemVer()
  prevVersion: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsBoolean()
  latest: boolean;

  @ApiProperty({required: false})
  @IsOptional()
  uploadDate: Date;

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
    comp.latest = entity.latest;
    comp.uploadDate = entity.createdDate;

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
  @IsOptional()
  formation: string

  @ApiProperty({required: false, type: PlatformDto})
  @ValidateNested()
  @Type(() => PlatformDto)
  platform: PlatformDto;

  toString(){
    return JSON.stringify(this)
  }
}

export class ComponentStateDto{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({enum: DeviceComponentStateEnum })
  @IsEnum(DeviceComponentStateEnum)
  state: DeviceComponentStateEnum;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  error?: string

  toString(){
    return JSON.stringify(this)
  }
}

export class DiscoverySoftwareV2Dto {

  @ApiProperty({required: false})
  @IsString({each: true})
  @IsNotEmpty({each: true})
  @IsArray()
  @IsOptional()
  formations: string[];

  @ApiProperty({required: false})
  @IsString({each: true})
  @IsNotEmpty({each: true})
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(v => v.toLowerCase().trim().replace(/\s+/g, "-"))
      : value
  )
  platforms: string[];

  @ApiProperty({required: false, isArray: true, type: ComponentStateDto})
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ComponentStateDto)
  components: ComponentStateDto[]

  toString(){
    return JSON.stringify(this)
  }
}



