import { DeliveryItemEntity } from "@app/common/database-tng/entities";
import { HashAlgorithmEnum } from "@app/common/database/entities/enums.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class HashDto {
  @ApiProperty({enum: HashAlgorithmEnum})
  @IsOptional()
  algorithm: HashAlgorithmEnum;
  
  @ApiProperty()
  @IsOptional()
  hash: string;
  
  static fromHashDto(hash: HashDto): HashDto {
    const dto = new HashDto();
    dto.algorithm = hash.algorithm;
    dto.hash = hash.hash;
    return dto
  }
}


export class DeliveryItemDto {
  @ApiProperty()
  catalogId: string;
  
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemKey: string;

  @ApiProperty({required: false})
  artifactType 

  @ApiProperty({ required: false })
  metaData: string;

  @ApiProperty()
  url: string;

  @ApiProperty({required: false})
  size: number

  @ApiProperty({ required: false })
  @IsOptional()
  hash: HashDto
  

  toString() {
    return JSON.stringify(this);
  }

  static fromDeliveryItemEntity(diE: DeliveryItemEntity): DeliveryItemDto {
    const dto = new DeliveryItemDto();
    dto.catalogId = diE.delivery.catalogId;
    dto.id = diE.id;
    dto.itemKey = diE.itemKey;
    dto.metaData = diE.metaData;
    dto.url = diE.path;
    dto.size = diE.size;
    return dto
  }
  static fromDeliveryItemDto(diDto: DeliveryItemDto): DeliveryItemDto {
    const dto = new DeliveryItemDto();
    dto.catalogId = diDto.catalogId;
    dto.id = diDto.id;
    dto.itemKey = diDto.itemKey;
    dto.metaData = diDto.metaData;
    dto.url = diDto.url;
    dto.size = diDto.size;

    if(diDto.hash){
      dto.hash = HashDto.fromHashDto(diDto.hash)
    }
    return dto
  }
}