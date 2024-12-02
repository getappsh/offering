import { ApiProperty } from "@nestjs/swagger";
import { MapMetadatatDto } from "./map-metadata.dto";
import { ImportResDto } from "./import-res-dto";
import { MapEntity, MapImportStatusEnum } from "@app/common/database/entities";
import { ErrorDto } from "../../error";

export class ImportStatusResDto extends ImportResDto {

  @ApiProperty({ type: MapMetadatatDto, required: false })
  metaData: MapMetadatatDto

  toString() {
    return JSON.stringify(this);
  }

  static fromMapEntity(mE: MapEntity) {
    const res = new ImportStatusResDto()
    res.importRequestId = mE.catalogId
    res.status = mE.status
    if (mE.status === MapImportStatusEnum.ERROR) {
      res.error = {} as ErrorDto
      res.error.message = mE.errorReason
    }

    res.metaData = new MapMetadatatDto()
    res.metaData.jobId = mE.jobId
    res.metaData.exportStart = mE.exportStart
    res.metaData.exportEnd = mE.exportEnd
    res.metaData.progress = mE.progress
    res.metaData.fileName = mE.fileName
    res.metaData.packageUrl = mE.packageUrl
    res.metaData.size = mE.size

    return res
  }
}
