import { deliveryStatusEntityStub } from "@app/common/database/test/support/stubs"
import { PrepareDeliveryReqDto } from "../dto/prepare-delivery-req.dto"
import { ItemTypeEnum } from "@app/common/database/entities"


export const prepareDeliveryReqDtoStub = (): PrepareDeliveryReqDto => {
  const eStub = deliveryStatusEntityStub()

  return {
    deviceId: eStub.device.ID,
    catalogId: eStub.catalogId,
    itemType: ItemTypeEnum.CACHE,
  }
}
