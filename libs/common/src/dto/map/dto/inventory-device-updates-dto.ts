import { MapEntity } from "@app/common/database/entities"
import { InventoryUpdatesReqDto } from "./inventory-updates-req-dto"

export class InventoryDeviceUpdatesDto extends InventoryUpdatesReqDto {

  maps: MapEntity[]

  static fromInventoryUpdatesReq(req: InventoryUpdatesReqDto, maps: MapEntity[]){
    const deviceUpdates = new InventoryDeviceUpdatesDto()
    deviceUpdates.deviceId = req.deviceId
    deviceUpdates.inventory = req.inventory
    deviceUpdates.maps = maps
    return deviceUpdates
  }

  toString(): string {
    return JSON.stringify(this)
  }
}