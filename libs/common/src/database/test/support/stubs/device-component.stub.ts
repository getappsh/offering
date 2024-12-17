import { DeviceComponentEntity, DeviceComponentStateEnum } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";

export const deviceComponentEntityStub = (): DeviceComponentEntity => {
  return {
    component: uploadVersionEntityStub(),
    state: DeviceComponentStateEnum.INSTALLED,
  } as DeviceComponentEntity
}