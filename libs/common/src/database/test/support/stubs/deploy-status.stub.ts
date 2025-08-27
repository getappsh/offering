import { ItemTypeEnum, DeployStatusEntity, DeployStatusEnum } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { deviceEntityStub } from "./device.stub";


export const deployStatusEntityStub = (): DeployStatusEntity => {
  return {
    device: deviceEntityStub(),
    catalogId: uploadVersionEntityStub().catalogId,
    deployStatus: DeployStatusEnum.START,
    type: ItemTypeEnum.SOFTWARE,
    deployStart: null,
    deployStop: null,
    deployDone: null,
    deployEstimateTime: 3600,
    progress: 24,
    currentTime: null,
  } as unknown as DeployStatusEntity
};






