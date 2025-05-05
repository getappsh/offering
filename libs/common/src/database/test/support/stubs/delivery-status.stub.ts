import { DeliveryStatusEntity, DeliveryStatusEnum, ItemTypeEnum } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { deviceEntityStub } from "./device.stub";

export const deliveryStatusEntityStub = (): DeliveryStatusEntity => {
  return {
    device: deviceEntityStub(),
    catalogId: uploadVersionEntityStub().catalogId,
    deliveryStatus: DeliveryStatusEnum.DOWNLOAD,
    type: ItemTypeEnum.SOFTWARE,
    downloadStart: null,
    downloadDone: null,
    downloadStop: null,
    bitNumber: 103100,
    downloadSpeed: 3.212,
    progress: 56.901,
    downloadEstimateTime: 343,
    currentTime: null,
  } as DeliveryStatusEntity

};
