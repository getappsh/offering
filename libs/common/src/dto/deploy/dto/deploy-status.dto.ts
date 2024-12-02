import { ItemTypeEnum, DeployStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class DeployStatusDto {


  @ApiProperty({required: false})
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  catalogId: string;
  
  @ApiProperty({required: false})  
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  deployStop: Date;

  @ApiProperty({required: false})
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  deployStart: Date;

  @ApiProperty({required: false})
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  deployDone: Date;
  
  @ApiProperty({required: false})
  @IsOptional()
  deployEstimateTime: number;

  @ApiProperty({required: false})
  @IsOptional()    
  @Type(() => Date)
  @IsDate()
  currentTime: Date;

  @ApiProperty({enum: DeployStatusEnum})
  @IsEnum(DeployStatusEnum)
  deployStatus: DeployStatusEnum

  @ApiProperty({enum: ItemTypeEnum})
  @IsEnum(ItemTypeEnum)
  type: ItemTypeEnum


  toString() {
    return JSON.stringify(this)
  }

}