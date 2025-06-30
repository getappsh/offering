import { Feature, FeatureCollection, MultiPolygon, Polygon } from "@turf/turf"
import { MCRasterRecordDto } from "./recordsRes.dto"
import { ImportResPayload } from "./import-res-payload"
import { Footprint, FootprintType } from '@app/common/dto/libot/dto/footprint';
import * as turf from '@turf/turf';


export class ExportJsonDto {
  id: string
  type: string
  classification: string
  productName: string
  description: string
  srsId: string
  producerName: string
  creationDate: string
  ingestionDate: string
  updateDate: string
  sourceDateStart: string
  sourceDateEnd: string
  minHorizontalAccuracyCE90: number
  sensors: string[]
  region: string[]
  productId: string
  productVersion: string
  productType: string
  srsName: string
  maxResolutionDeg: number
  maxResolutionMeter: number
  footprint: MultiPolygon
  layerPolygonParts: FeatureCollection<Polygon>
  includedInBests: any[]
  productBoundingBox: string
  displayPath: string
  transparency: string
  tileOutputFormat: string
  sha256: string

  static fromRecordAndExportPayload(record: MCRasterRecordDto, payload: ImportResPayload): ExportJsonDto {
    const exportJson = new ExportJsonDto()
    exportJson.id = record["mc:id"]
    exportJson.type = record["mc:type"]
    exportJson.classification = record["mc:classification"]
    exportJson.productName = record["mc:productName"]
    exportJson.description = record["mc:description"]
    exportJson.srsId = record["mc:srsId"]
    exportJson.producerName = record["mc:producerName"]
    exportJson.creationDate = record["mc:creationDate"]
    exportJson.ingestionDate = record["mc:ingestionDate"]
    exportJson.updateDate = record["mc:updateDate"]
    exportJson.sourceDateStart = record["mc:sourceDateStart"]
    exportJson.sourceDateEnd = record["mc:sourceDateEnd"]
    exportJson.minHorizontalAccuracyCE90 = Number(record["mc:minHorizontalAccuracyCE90"])
    exportJson.sensors = record["mc:sensors"].split(",")
    exportJson.region = record["mc:region"].split(",")
    exportJson.productId = record["mc:productId"]
    exportJson.productVersion = record["mc:productVersion"]
    exportJson.productType = record["mc:productType"]
    exportJson.srsName = record["mc:srsName"]
    exportJson.maxResolutionDeg = Number(record["mc:maxResolutionDeg"])
    exportJson.maxResolutionMeter = Number(record["mc:maxResolutionMeter"])
    const recordFP = Footprint.toPolygonFeature(record["mc:footprint"])
    const intersectFP = turf.intersect(recordFP, payload.ROI.features[0])
    if (intersectFP.geometry.type === FootprintType.MULTI_POLYGON) {
      exportJson.footprint = intersectFP.geometry
      exportJson.layerPolygonParts = turf.featureCollection<Polygon>(intersectFP.geometry.coordinates.map(c => turf.polygon(c)))
    } else {
      exportJson.footprint = turf.multiPolygon([intersectFP.geometry.coordinates]).geometry
      exportJson.layerPolygonParts = turf.featureCollection<Polygon>([turf.polygon(intersectFP.geometry.coordinates)])
    }
    exportJson.includedInBests = record["mc:includedInBests"]
    exportJson.productBoundingBox = record["mc:productBBox"]
    exportJson.displayPath = record["mc:displayPath"]
    exportJson.transparency = record["mc:transparency"]
    exportJson.tileOutputFormat = record["mc:tileOutputFormat"]
    exportJson.sha256 = record["mc:sha256"]

    return exportJson
  }

  toString(): string {
    return JSON.stringify(this);
  }
}