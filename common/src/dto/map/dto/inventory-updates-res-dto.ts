import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { MapDto } from "./map.dto"

export class InventoryUpdatesResDto {

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'boolean' },
    example: { "mapId_1": true, "mapId_2": false }
  })
  updates: Record<string, boolean>


  toString(): string {
    return JSON.stringify(this)
  }
}

export class InventoryUpdateStatusResDto {

  @ApiProperty({ description: "Indicates whether the map is updated." })
  isUpdated: boolean;

  @ApiProperty({ required: false, description: "Catalog ID of the map. a registered catalog ID if the map is unknown." })
  catalogId?: string;

  @ApiProperty({ required: false, description: "The updated map details if available.", type: MapDto })
  updatedMap?: MapDto;

  toString(): string {
    return JSON.stringify(this)
  }
}

@ApiExtraModels(InventoryUpdateStatusResDto, MapDto)
export class InventoryUpdatesResV2Dto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(InventoryUpdateStatusResDto) },
    example: {
      "mapId_1": { isUpdated: true, updatedMap: { /* MapDto example here */ } },
      "mapId_2": { isUpdated: false, updatedMap: { /* MapDto example here */ } },
      "mapId_3_unknown": { isUpdated: false, catalogId: "mapId_3", updatedMap: { /* MapDto example here */ } }
    }
  })
  updates: Record<string, InventoryUpdateStatusResDto>;

  toString(): string {
    return JSON.stringify(this);
  }
}