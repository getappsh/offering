import { Feature, MultiPolygon, Polygon } from "@turf/turf"
import * as turf from '@turf/turf';

export enum FootprintType {
  POLYGON = "Polygon",
  MULTI_POLYGON = "MultiPolygon"
}

export class Footprint {
  type: FootprintType
  coordinates: []
  bbox: [number, number, number, number]

  constructor(fpJson: string) {
    const footprint: Footprint = JSON.parse(fpJson)
    this.type = footprint.type
    this.bbox = footprint.bbox
    this.coordinates = footprint.coordinates
  }

  static toPolygonFeature(fpJson: string): Feature<Polygon | MultiPolygon> {
    const footprint = new Footprint(fpJson)
    const fpPolygon = footprint.type == FootprintType.POLYGON ? turf.polygon(footprint.coordinates) : turf.multiPolygon(footprint.coordinates);
    fpPolygon.bbox = footprint.bbox
    return fpPolygon
  }
}