import { productEntityStubNorthGazaRecent } from "@app/common/database/test/support/stubs/product.stub";
import { ImportAttributes } from "../dto/importAttributes.dto";

export const importAttrsStubNoProduct = (): ImportAttributes => {
  const importAttrs = new ImportAttributes()
  importAttrs.Points = "35.28909088,31.51315139,35.36055325,31.56728957"
  return importAttrs
}

export const importAttrsStubNorthGazaRecentMoreThen60Pres = (): ImportAttributes => {
  const importAttrs = new ImportAttributes()
  importAttrs.Points = "34.58389623,31.52330469,34.60622822,31.55883255"
  return importAttrs
}

export const importAttrsStubNorthGazaRecentFull = (): ImportAttributes => {
  const importAttrs = new ImportAttributes()
  importAttrs.Points = "34.60945396,31.52298742,34.62086808,31.54117605",
  importAttrs.product = productEntityStubNorthGazaRecent()
  return importAttrs
}

export const importAttrsStubNorthGazaMoreThen60Pres = (): ImportAttributes => {
  const importAttrs = new ImportAttributes()
  importAttrs.Points = "34.58265557,31.53906127,34.60250623,31.57120069"
  return importAttrs
}

