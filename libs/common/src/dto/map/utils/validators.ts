import { Feature, MultiPolygon, Polygon, area, bbox, bboxPolygon, booleanWithin, intersect, multiPolygon, point, polygon } from "@turf/turf";

export class Validators {

  static pointsStringToArray(points: string): number[] {
    return points.split(",").map(val => Number(val.trim())).filter(val => !isNaN(val));
  }


  // BBox validator
  static isBBoxAreaValid(bBox: number[]): boolean {
    const bboxArea = Math.abs(bBox[2] - bBox[0]) * Math.abs(bBox[3] - bBox[1]);
    const maxArea = Number(process.env.MAX_BBOX_AREA_4_EXPORT) ?? 0.01
    return bboxArea < 0 || bboxArea <= maxArea
  }

  static isValidStringForBBox(bBox: string): boolean {
    const bBoxValues: number[] = Validators.pointsStringToArray(bBox)
    return bBoxValues !== null && bBoxValues.length === 4
  }

  static bBoxStringToBboxArray(bBox: string): [number, number, number, number] {
    const bbox = Validators.pointsStringToArray(bBox)
    return [
      Math.min(bbox[0], bbox[2]),
      Math.min(bbox[1], bbox[3]),
      Math.max(bbox[0], bbox[2]),
      Math.max(bbox[1], bbox[3])
    ]
  }

  static bBoxToPolygon(bbox: [number, number, number, number]) {
    return bboxPolygon(bbox)
  }

  static isBBoxInFootprint(bBox: Feature, footprint: Feature): boolean {
    return booleanWithin(bBox, footprint)
  }

  static isBBoxIntersectFootprint(bBox: Feature<Polygon>, footprint: Feature<Polygon | MultiPolygon>): Feature<Polygon | MultiPolygon> | null {
    return intersect(bBox, footprint)
  }

  static getIntersectPercentage(poly: Feature<Polygon>, availablePoly: Feature<Polygon | MultiPolygon>) {
    let polyArea = area(poly)
    let availPolyArea = area(availablePoly)

    return availPolyArea / polyArea * 100
  }

  // Polygon validators 
  static stringToPolygon(pointsString: string) {
    const points: number[] = Validators.pointsStringToArray(pointsString)
    const polygon: number[][] = []
    if (points !== null && points.length % 2 === 0) {
      for (let i = 0; i < points.length; i = i + 2) {
        const point = []
        point.push(points[i])
        point.push(points[i + 1])
        polygon.push(point)
      }
    }
    return polygon
  }

  static isValidPolygon(polygon: number[][]) {
    return polygon != null &&
      polygon.length >= 4 &&
      polygon[0][0] === polygon[polygon.length - 1][0] &&
      polygon[0][1] === polygon[polygon.length - 1][1]
  }

  static isValidStringForPolygon(polyStr: string): false | number[][] {
    const polygon = Validators.stringToPolygon(polyStr)
    return Validators.isValidPolygon(polygon) ? polygon : false
  }

  static isPolygonAreaValid(poly: Feature, maxSize?: number): boolean {
    const polyArea = area(poly) / 1000000
    const maxArea = maxSize ?? 100
    return polyArea < 0 || polyArea <= maxArea
  }
  
}