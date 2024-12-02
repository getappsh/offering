import { deliveryStatusEntityStub } from "@app/common/database/test/support/stubs"
import { DeliveryStatusDto } from "../dto/delivery-status.dto"


export const deliveryStatusDtoStub = (): DeliveryStatusDto => {
  const eStub = deliveryStatusEntityStub()

  return {
    deviceId: eStub.device.ID,
    catalogId: eStub.catalogId,
    deliveryStatus: eStub.deliveryStatus,
    type: eStub.type,
    downloadStart: eStub.downloadStart,
    downloadDone: eStub.downloadDone,
    downloadStop: eStub.downloadStop,
    bitNumber: eStub.bitNumber,
    downloadData: eStub.downloadData,
    downloadSpeed: eStub.downloadSpeed,
    downloadEstimateTime: eStub.downloadEstimateTime,
    currentTime: eStub.currentTime,
  }
}
