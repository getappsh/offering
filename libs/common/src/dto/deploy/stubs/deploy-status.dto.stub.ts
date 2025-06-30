import { deployStatusEntityStub } from "@app/common/database/test/support/stubs";
import { DeployStatusDto } from "../dto/deploy-status.dto";

export const deployStatusDtoStub = (): DeployStatusDto => {
  const eStub = deployStatusEntityStub()

  return {
    deviceId: eStub.device.ID,
    catalogId: eStub.catalogId,
    deployStop: eStub.deployStop,
    deployStart: eStub.deployStart,
    deployDone: eStub.deployDone,
    deployEstimateTime: eStub.deployEstimateTime,
    currentTime: eStub.currentTime,
    deployStatus: eStub.deployStatus,
    type: eStub.type,
  }
}
