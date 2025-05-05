import { DeviceComponentEntity, DeviceComponentStateEnum, ReleaseEntity } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { deviceEntityStub } from "./device.stub";

export const deviceComponentEntityStub = (): DeviceComponentEntity => {
  const upload = uploadVersionEntityStub();
  return {
    device: deviceEntityStub(),
    release: { catalogId: upload.catalogId, version: upload.version } as ReleaseEntity,
    state: DeviceComponentStateEnum.INSTALLED,
    error: null
  } as DeviceComponentEntity
}