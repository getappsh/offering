import { MapEntity, MapImportStatusEnum } from "@app/common/database/entities";
import { productEntityStubNorthGaza, productEntityStubNorthGazaRecent } from "./product.stub";

export const mapEntityStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id",
    fileName: "file-name.ptg",
    zoomLevel: 13,
    createDateTime: new Date("2023-07-19T14:24:54.885Z"),
    boundingBox: "35.71927028,32.01644704,35.72253451,32.01871780",
    packageUrl: null,
    footprint: null,
    status: MapImportStatusEnum.START,
    mapProduct: productEntityStubNorthGaza()
  } as MapEntity
}

export const updatedMapFromGazeNorthStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id-1",
    boundingBox: "34.50547135,31.43747849,34.53916147,31.45324041",
    footprint: "34.50547135,31.43747849,34.53916147,31.43747849,34.53916147,31.45324041,34.50547135,31.45324041,34.50547135,31.43747849",
    status: MapImportStatusEnum.DONE,
    isUpdated: true,
    mapProduct: productEntityStubNorthGaza()
  } as MapEntity
}

export const obsoleteMapFromGazeNorthStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id-2",
    boundingBox: "34.50547135,31.43747849,34.53916147,31.45324041",
    footprint: "34.50547135,31.43747849,34.53916147,31.43747849,34.53916147,31.45324041,34.50547135,31.45324041,34.50547135,31.43747849",
    status: MapImportStatusEnum.DONE,
    isUpdated: false,
    mapProduct: productEntityStubNorthGaza()
  } as MapEntity
}

export const obsoleteMapFromGazeNorthRecentStub = (): MapEntity => {
  return {
    catalogId: "map-catalog-id-3",
    boundingBox: "34.50547135,31.43747849,34.53916147,31.45324041",
    footprint: "34.50547135,31.43747849,34.53916147,31.43747849,34.53916147,31.45324041,34.50547135,31.45324041,34.50547135,31.43747849",
    status: MapImportStatusEnum.DONE,
    isUpdated: false,
    mapProduct: productEntityStubNorthGazaRecent()
  } as MapEntity
}


export const expiredMap = (): MapEntity => {
  return {
    expiredDate: new Date(Date.now() - 10000),
    status: MapImportStatusEnum.DONE
  } as MapEntity
}

export const notExpiredMap = (): MapEntity => {
  return {
    expiredDate: new Date(Date.now() + 10000),
    status: MapImportStatusEnum.DONE
  } as MapEntity
}

export const withoutExpiredMap = (): MapEntity => {
  return {
    expiredDate: null,
    status: MapImportStatusEnum.DONE
  } as MapEntity
}

export const withoutExpiredMapInProgress = (): MapEntity => {
  return {
    expiredDate: null,
    status: MapImportStatusEnum.IN_PROGRESS
  } as MapEntity
}