import { SuperAgentTest } from "supertest";
import { ConfigOption, getProjectConfigOption } from "./projectCreating.spec";
import { DEVICE, DISCOVER, INSTALLED } from "@app/root/api/src/utils/paths";



export const discoveryTest = async (request: SuperAgentTest) => {
  const configOption = await getProjectConfigOption(request);
  const discoverData = getDiscoveryData(configOption);
  const res = (await request.post(`${DEVICE}${DISCOVER}`).send(discoverData).expect(201)).body
  expect(res).toHaveProperty("map")
  expect(res).toHaveProperty("software")
  
  const installedRes = (await request.get(`${DEVICE}${INSTALLED}${getDeviceId(discoverData)}`).expect(200)).body
  expect(installedRes).toHaveProperty("maps")
  expect(installedRes).toHaveProperty("components")
}

export const getDiscoveryData = (details?: ConfigOption) => {
  const data = {
    general: {
      personalDevice: {
        name: "my name",
        idNumber: "idNumber-123",
        personalNumber: "personalNumber-123"
      },
      situationalDevice: {
        weather: 23.2,
        bandwidth: 0,
        time: new Date(),
        operativeState: true,
        power: 38,
        location: {
          lat: "-8.5612",
          long: "-62.2928",
          alt: "500"
        }
      },
      physicalDevice: {
        MAC: "ee:e0:b0:bf:8b:38",
        ID: "51490b1c-3a44-4c11-aa96-66dda33d89c9",
        IP: "169.227.199.206",
        OS: details?.operationsSystem,
        serialNumber: "serialNumber-123",
        possibleBandwidth: "yes",
        availableStorage: "50mb"
      }
    },
    discoveryType: "get-app",
    softwareData: {
      formation: details?.formations,
      platform: {
        name: details?.platforms,
        platformNumber: "1.0.6",
        virtualSize: 12024,
        components: []
      },
    },
    mapData: {
      productId: "string",
      productName: "string",
      productVersion: "string",
      productType: "string",
      description: "string",
      boundingBox: "string",
      crs: "string",
      imagingTimeStart: "string",
      imagingTimeEnd: "string",
      creationDate: "string",
      source: "string",
      classification: "string",
      compartmentalization: "string",
      region: "string",
      sensor: "string",
      precisionLevel: "string",
      resolution: "string"
    }
  }

  return data
}

export const getDeviceId = (generalData:any) => {
  return generalData.general.physicalDevice.ID
}
