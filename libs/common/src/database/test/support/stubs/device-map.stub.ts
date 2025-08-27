import { DeviceMapStateEntity, DeviceMapStateEnum, MapEntity, MapImportStatusEnum } from "@app/common/database/entities";
import { mapEntityStub } from "./map.stub";
import { deviceEntityStub } from "./device.stub";

export const MapDeviceEntityStub = (): DeviceMapStateEntity => {
  return {
    map: mapEntityStub(),
    state: DeviceMapStateEnum.INSTALLED
  } as DeviceMapStateEntity
}