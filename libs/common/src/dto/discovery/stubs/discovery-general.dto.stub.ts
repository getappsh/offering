import { OS } from "@app/common/database/entities"
import { GeneralDiscoveryDto, GeoLocationDto, PersonalDiscoveryDto, PhysicalDiscoveryDto, SituationalDiscoveryDto } from "../dto/discovery-general.dto"

export const personalDiscoveryDtoStub = (): PersonalDiscoveryDto => {
  return {
    name:"tank",
    idNumber:"idNumber-123",
    personalNumber: "personalNumber-123"
  }
}


export const geoLocationDtoStub = (): GeoLocationDto => {
  return {
    lat:"16.6396",
    long:"48.7680",
    alt:"500"
  }
}

export const situationalDiscoveryDtoStub = (): SituationalDiscoveryDto => {
  return {
    weather: 23.2,
    bandwidth: 0,
    time: new Date("2023-04-23T12:07:57.994Z"),
    operativeState: true,
    power: 38,
    location: geoLocationDtoStub(),
    availableStorage: "50mb"
  }
}

export const physicalDiscoveryDtoStub = (): PhysicalDiscoveryDto => {
  return {
    MAC:"e2:36:3b:6c:93:cc",
    ID:"f1fefaed-1fe5-4a06-a70e-8895733e7683",
    IP:"195.94.243.217",
    OS: OS.WINDOWS,
    serialNumber:"serialNumber-123",
    possibleBandwidth:"yes",
    availableStorage:"50mb"
  }
}

export const generalDiscoveryDtoStub = (): GeneralDiscoveryDto => {
  return {
    personalDevice: personalDiscoveryDtoStub(),
    situationalDevice: situationalDiscoveryDtoStub(),
    physicalDevice: physicalDiscoveryDtoStub()
  }
}
