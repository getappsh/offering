import { CREATE, GET_MAP, STATUS } from "@app/root/api/src/utils/paths";
import { SuperAgentTest } from "supertest";
import { getDeviceId, getDiscoveryData } from "./discovery.spec";
import { CreateImportResDto } from "@app/common/dto/map";

export const importCreateTest = async (request: SuperAgentTest) => {
  const mapRes = (await request.post(`${GET_MAP}${CREATE}`).send(getMapProperties()).expect(201)).body
  expect(mapRes).toBeValidWithClassValidator(CreateImportResDto)
  const statusRes = (await request.get(`${GET_MAP}${STATUS}${mapRes.importRequestId}`).expect(200)).body
  // expect(statusRes).toBeValidWithClassValidator()
}

const getMapProperties = () => {
  const data = {
    deviceId: getDeviceId(getDiscoveryData()),
    mapProperties: {
      productName: "e2e test",
      productId: process.env.PRODUCT_ID,
      zoomLevel: 0,
      boundingBox: process.env.BOUNDING_BOX,
      targetResolution: 0,
      lastUpdateAfter: 0
    }
  }
  return data;
}