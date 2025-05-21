import e from "express";
import { ResolutionMapper } from "../utils/resolutionMapper"
import { Feature, point, polygon, Polygon, Position } from "@turf/turf";
import { Validators } from "../utils/validators";
import { Logger } from "@nestjs/common";

export class DiscoveryAttributes {

  private readonly logger = new Logger(DiscoveryAttributes.name);


  private _bBox: [number, number, number, number]
  private _polygon: Feature<Polygon>
  productId: string
  productType: string

  // private _BoundingBox: string | null
  CRS: string = "urn:x-ogc:def:crs:EPSG:6.11:4326";
  ingestionDate: Date
  private _resolutionDeg: number

  public get BBox() {
    return this._bBox
  }

  public get Polygon() {
    return this._polygon
  }

  public get IngestionDate() {
    return this.ingestionDate.toISOString()
  }

  public set Polygon(polygon: Feature<Polygon>) {
    this._polygon = polygon
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

  public PolygonCoordinatesToString(): string {
    return this._polygon.geometry.coordinates.join(' ').split(',').join(' ')
  }

  constructor() {

    let poly: boolean | Position[]
    if (process.env.MANEUVER_AREA) {
      if (poly = Validators.isValidStringForPolygon(process.env.MANEUVER_AREA)) {
        this._polygon = polygon([poly as unknown as Position[]])
      } else {
        this.logger.error("'MANEUVER_AREA' env is not a valid polygon")
      }
    }

    if (process.env.SEQUENTIAL_PRODUCT_ID) {
      const [firstPart, secondPart] = process.env.SEQUENTIAL_PRODUCT_ID.split("-");
      if (!firstPart || !secondPart) {
        this.logger.error("'SEQUENTIAL_PRODUCT_ID' env is not a valid syntax")
      } else {
        this.productId = firstPart
        this.productType = secondPart
      }
    }
    this.ResolutionDeg = parseFloat(process.env.TARGET_RESOLUTION || "17");
    if (process.env.MC_CSW_REF_DATE) {
      this.ingestionDate = new Date(process.env.MC_CSW_REF_DATE);
      if (this.ingestionDate.toString() === "Invalid Date") {
        this.logger.error("MC_CSW_REF_DATE is not a valid date")
      }
    } else {
      this.ingestionDate = new Date("2023-10-15T00:00:01Z")
      this.logger.error("MC_CSW_REF_DATE is not set, using default date")
    }
  }


  toString() {
    return JSON.stringify(this);
  }
}

