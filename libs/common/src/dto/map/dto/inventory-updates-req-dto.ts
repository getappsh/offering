import { DeviceMapStateEnum } from "@app/common/database/entities"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class InventoryUpdatesReqDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string


  @ApiProperty({
    type: "object", additionalProperties: {
      enum: Object.values(DeviceMapStateEnum),
      title: "map state",
    },
    example: { "mapId_1": DeviceMapStateEnum.DELIVERY, "mapId_2": DeviceMapStateEnum.IMPORT }
  })
  @IsNotEmpty()
  inventory: Record<string, DeviceMapStateEnum>

  toString(): string {
    return JSON.stringify(this)
  }
}