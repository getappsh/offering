import { ItemTypeEnum, DeployStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class DeployStatusDto {


  @ApiProperty({required: true})
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  catalogId: string;
  
  @ApiProperty({required: false})  
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  deployStop?: Date;

  @ApiProperty({required: false})
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  deployStart?: Date;

  @ApiProperty({required: false})
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  deployDone?: Date;
  
  @ApiProperty({required: false})
  @IsOptional()
  deployEstimateTime?: number;

  @ApiProperty({required: true})
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  currentTime: Date;

  @ApiProperty({enum: DeployStatusEnum})
  @IsEnum(DeployStatusEnum)
  deployStatus?: DeployStatusEnum


  @ApiProperty({required: false, type: 'integer', format: 'int32', minimum: 0, maximum: 100})
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiProperty({enum: ItemTypeEnum})
  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum


  toString() {
    return JSON.stringify(this)
  }

}