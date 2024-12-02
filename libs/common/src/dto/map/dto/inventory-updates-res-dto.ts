import { ApiProperty } from "@nestjs/swagger"

export class InventoryUpdatesResDto{

  @ApiProperty({type: 'object', additionalProperties: {type: 'boolean'}})
  updates: Record<string, boolean>


  toString(): string{
    return JSON.stringify(this)
  }
}