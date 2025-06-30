import { DeviceEntity, MapEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class MapPutDto {

  catalogId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string

  toString() {
    return JSON.stringify(this);
  }

  static fromMapEntity(mE:MapEntity){
    const map = new MapPutDto()
    map.catalogId = mE.catalogId
    map.name = mE.name

    return map
  }
}