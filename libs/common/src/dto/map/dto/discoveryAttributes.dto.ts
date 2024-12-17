import { ResolutionMapper } from "../utils/resolutionMapper"

export class DiscoveryAttributes {

  private _bBox: [number, number, number, number]
  // private _BoundingBox: string | null
  CRS: string = "urn:x-ogc:def:crs:EPSG:6.11:4326";
  ingestionDate: Date
  private _resolutionDeg: number

  public get BBox() {
    return this._bBox
  }
  
  public get IngestionDate() {
    return this.ingestionDate.toISOString()
  }


  public get BoundingBoxToSting() {
    return `${this._bBox[0]},${this._bBox[1]},${this._bBox[2]},${this._bBox[3]}`;
  }

  public set BoundingBox(bBox: [number, number, number, number]) {
    this._bBox = bBox
  }

  public get ResolutionDeg() {
    return this._resolutionDeg
  }

  public set ResolutionDeg(val: string | number) {
    this._resolutionDeg = ResolutionMapper.level2Resolution(Number(val))
  }

  constructor() {
    this.ResolutionDeg = (process.env.TARGET_RESOLUTION) ?? 17
    this.ingestionDate = new Date(process.env.MC_CSW_REF_DATE)
  }

  toString() {
    return JSON.stringify(this);
  }
}

