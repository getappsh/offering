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
}