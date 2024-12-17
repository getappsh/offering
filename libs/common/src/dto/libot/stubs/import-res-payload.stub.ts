import { LibotExportStatusEnum } from "@app/common/database/entities"
import { Artifact, ArtifactsLibotEnum, ImportResPayload } from "../dto/import-res-payload"

export const resPayloadFullComplete = (): ImportResPayload => {
  const importRes = new ImportResPayload()
  importRes.catalogRecordID = "some record Id"
  importRes.id = 1234
  importRes.progress = 1234
  importRes.estimatedSize = 1234
  importRes.createdAt = new Date(Date.now()).toISOString()
  importRes.finishedAt = new Date(Date.now() + 10).toISOString()
  importRes.expiredAt = new Date(Date.now() + 1000).toISOString()  
  importRes.errorReason = "some error"
  importRes.status = LibotExportStatusEnum.COMPLETED
  importRes.artifacts = []
  importRes.artifacts[0] = {} as Artifact
  importRes.artifacts[0].type = ArtifactsLibotEnum.GPKG
  importRes.artifacts[0].url = "some url"
  importRes.artifacts[0].name = "some name"
  importRes.artifacts[0].size = 2222
  importRes.artifacts[1] = {} as Artifact
  importRes.artifacts[1].type = ArtifactsLibotEnum.METADATA
  importRes.artifacts[0].url = "some url"
  importRes.artifacts[0].name = "some name"
  importRes.artifacts[0].size = 2222

  return importRes
}

export const resPayloadOnlyWithPackageUrl = (): ImportResPayload => {
  const importRes = new ImportResPayload()
  importRes.status = LibotExportStatusEnum.COMPLETED
  importRes.artifacts = []
  importRes.artifacts[0] = {} as Artifact
  importRes.artifacts[0].type = ArtifactsLibotEnum.GPKG
  importRes.artifacts[0].url = "some url"

  return importRes
}

export const resPayloadOnyWithMateData = (): ImportResPayload => {
  const importRes = new ImportResPayload()
  importRes.status = LibotExportStatusEnum.COMPLETED
  importRes.artifacts = []
  importRes.artifacts[0] = {} as Artifact
  importRes.artifacts[0].type = ArtifactsLibotEnum.METADATA
  importRes.artifacts[0].url = "some url"

  return importRes
}