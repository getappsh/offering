import { PrepareStatusEnum } from "@app/common/database/entities";
import { DeliveryEntity } from "@app/common/database/entities/delivery.entity";
import { deviceEntityStub, uploadVersionEntityStub } from "@app/common/database/test/support/stubs";

export const deliveryEntityStub = (): DeliveryEntity => {
  return {
    deviceId: deviceEntityStub().ID,
    catalogId: uploadVersionEntityStub().catalogId,
    status: PrepareStatusEnum.START,
    path: uploadVersionEntityStub().url,
    lastUpdatedDate: new Date()
  } as DeliveryEntity

};