import { LibotExportStatusEnum } from "@app/common/database/entities/enums.entity";
import { ImportPayload } from "./import-payload";
import { ApiProperty } from "@nestjs/swagger";

export enum ArtifactsLibotEnum {
  GPKG = "GPKG",
  LEGEND = "LEGEND",
  METADATA = "METADATA",
  THUMBNAILS_SMALL = "THUMBNAILS_SMALL",
  THUMBNAILS_MEDIUM = "THUMBNAILS_MEDIUM",
  THUMBNAILS_LARGE = "THUMBNAILS_LARGE"
}

export class Artifact {

  @ApiProperty({ required: false, enum: ArtifactsLibotEnum })
  type: ArtifactsLibotEnum

  @ApiProperty({ required: false })
  name: string

  @ApiProperty({ required: false })
  size: number

  @ApiProperty({ required: false })
  url: string
}

export class ImportResPayload extends ImportPayload {

  @ApiProperty({ required: false })
  id: number;

  @ApiProperty({ required: false })
  estimatedSize: number;

  @ApiProperty({ required: false })
  estimatedTime: number;

  @ApiProperty({ required: false, enum: LibotExportStatusEnum })
  status: LibotExportStatusEnum

  @ApiProperty({ required: false })
  errorReason: string;

  @ApiProperty({ required: false })
  progress: number

  @ApiProperty({ required: false })
  artifacts: Artifact[]

  @ApiProperty({ required: false })
  createdAt: string

  @ApiProperty({ required: false })
  expiredAt: string

  @ApiProperty({ required: false })
  finishedAt: string

  static fromImportRes(data: ImportResPayload) {

    const importRes = new ImportResPayload()

    importRes.catalogRecordID = data.catalogRecordID
    importRes.domain = data.domain
    importRes.artifactCRS = data.artifactCRS
    importRes.webhook = data.webhook
    importRes.ROI = data.ROI
    importRes.description = data.description
    importRes.keywords = data.keywords
    importRes.parameters = data.parameters

    importRes.id = data.id
    importRes.estimatedSize = data.estimatedSize
    importRes.estimatedTime = data.estimatedTime
    importRes.status = data.status
    importRes.errorReason = data.errorReason
    importRes.progress = data.progress
    importRes.artifacts = data.artifacts
    importRes.createdAt = data.createdAt
    importRes.expiredAt = data.expiredAt
    importRes.finishedAt = data.finishedAt

    return importRes
  }
  
  static fromImportPayload(data: ImportPayload) {

    const importRes = new ImportResPayload()

    importRes.catalogRecordID = data.catalogRecordID
    importRes.domain = data.domain
    importRes.artifactCRS = data.artifactCRS
    importRes.webhook = data.webhook
    importRes.ROI = data.ROI
    importRes.description = data.description
    importRes.keywords = data.keywords
    importRes.parameters = data.parameters

    return importRes
  }

  

  toString(): string {
    return JSON.stringify(this);
  }
}

export class ImportResPayloadDto  {

  @ApiProperty({ required: true, type: ImportResPayload })
  data: ImportResPayload;
}


