import { productEntityStubNorthGaza, productEntityStubSouthGaza, productEntityStubNorthGazaRecent } from "@app/common/database/test/support/stubs/product.stub";
import { MapProductResDto } from "../dto/map-product-res.dto";

export const productDtoStub = (): MapProductResDto[] => {
  const eStub = [productEntityStubNorthGazaRecent(), productEntityStubSouthGaza(), productEntityStubNorthGaza()]
  return eStub.map(e => MapProductResDto.fromProductEntity(e))
}
