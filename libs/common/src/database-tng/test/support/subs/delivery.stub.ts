import { DeliveryEntity } from "@app/common/database/entities/delivery.entity";
import { deviceEntityStub, uploadVersionEntityStub } from "@app/common/database/test/support/stubs";
import { PrepareStatusEnum } from "@app/common/dto/delivery";

export const deliveryEntityStub = (): DeliveryEntity => {
  return {
    deviceId: deviceEntityStub().ID,
    catalogId: uploadVersionEntityStub().catalogId,
    status: PrepareStatusEnum.START,
    path: uploadVersionEntityStub().s3Url,
    lastUpdatedDate: new Date()
  } as DeliveryEntity

};