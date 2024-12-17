import { DeviceMapStateEntity, DeviceMapStateEnum, MapEntity, MapImportStatusEnum } from "@app/common/database/entities";
import { deviceEntityStub } from "./device.stub";
import { mapEntityStub } from "./map.stub";

export const deviceMapEntityStub = (): DeviceMapStateEntity => {
  return {
    id: 1,
    createdDate: new Date(Date.now()),
    lastUpdatedDate: new Date(Date.now()),
    device: deviceEntityStub(),
    map: mapEntityStub(),
    state: DeviceMapStateEnum.IMPORT
  }
}