import { ApiProperty } from "@nestjs/swagger";
import { ComponentDto } from "../../discovery/dto/discovery-software.dto";
import { MapDto } from "@app/common/dto/map/dto/map.dto";

export class DeviceContentResDto {
  @ApiProperty({isArray: true, type: MapDto})
  maps: MapDto[];

  @ApiProperty({isArray: true, type: ComponentDto})
  components: ComponentDto[];

  toString(){
    return JSON.stringify(this);
  }
}

