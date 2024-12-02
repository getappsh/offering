export class RecordsResDto {
  "csw:GetRecordsResponse": RecordsBodyDto
}

export class RecordsBodyDto {
  version: string
  "csw:SearchStatus":{ timestamp: string }
  "csw:SearchResults": SearchResultsDto
  [key: string]: string | SearchResultsDto | { timestamp: string },
}

export class SearchResultsDto {
  numberOfRecordsMatched: number
  numberOfRecordsReturned: number
  nextRecord: number
  recordSchema: string
  elementSet: string
  "mc:MCRasterRecord": MCRasterRecordDto[]
}

export class MCRasterRecordDto {
  'mc:id': string
  'mc:productId': string
  'mc:productName': string
  'mc:classification': string
  'mc:creationDateUTC': string
  'mc:description': string
  'mc:footprint': string
  'mc:ingestionDate': string
  'mc:insertDate': string
  'mc:links': [any]
  'mc:maxResolutionDeg': string
  'mc:maxResolutionMeter': string
  'mc:minHorizontalAccuracyCE90': string
  'mc:producerName': string
  'mc:productBBox': string
  'mc:productSubType': string
  'mc:productType': string
  'mc:productVersion': string
  'mc:region': string
  'mc:sensors': string
  'mc:imagingTimeEndUTC': string
  'mc:imagingTimeBeginUTC': string
  'mc:SRS': string
  'mc:SRSName': string
  'mc:transparency': string
  'mc:type': string
  'mc:updateDateUTC': string
  'ows:BoundingBox': any
}

export class CatalogRecordDto {
  identifier: string
  creator: string
  subject: string
  abstract: string
  description: string
  title: string
  type: string
  boundingBox: string
  references: string
  updateDateUTC: string
  ingestionDate: string
  productVersion: string
  footprint: string
  imagingTimeBeginUTC: string
  imagingTimeEndUTC: string
  creationDateUTC: string
  insertDate: string
  maxResolutionDeg: string
  productSubType: string
  productType: string
  productId: string
  transparency: string
  region: string
}

