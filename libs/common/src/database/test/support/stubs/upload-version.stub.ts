import { UploadStatus, UploadVersionEntity } from "@app/common/database/entities";

export const uploadVersionEntityStub = (): UploadVersionEntity => {
  return {
    catalogId: "12312-xcv9x8-98hbk-0909",
    platform: 'platform',
    component: 'component',
    formation: 'formation',
    OS: 'OS',
    virtualSize: 0,
    version: 'version',
    baseVersion: null,
    prevVersion: null,
    metadata: {},
    url: 's3/path/',
    uploadStatus: UploadStatus.STARTED,
    deploymentStatus: null,
    securityStatus: null,
    policyStatus: null,
    project: null,
    assetType: "artifact"
  } as UploadVersionEntity
  

};