import { ApiProperty } from "@nestjs/swagger"

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