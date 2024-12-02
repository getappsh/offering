import { DeviceEntity } from "@app/common/database/entities";
import { physicalDiscoveryDtoStub } from "@app/common/dto/discovery";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { mapEntityStub } from "./map.stub";
import { MapDeviceEntityStub } from "./device-map.stub";

export const deviceEntityStub = (): DeviceEntity => {
  const physicalDevice = physicalDiscoveryDtoStub()
  return {
    ID: physicalDevice.ID,
    MAC: physicalDevice.MAC,
    IP: physicalDevice.IP,
    OS: physicalDevice.OS,
    serialNumber: physicalDevice.serialNumber,
    possibleBandwidth: physicalDevice.possibleBandwidth,
    availableStorage: physicalDevice.availableStorage,
    components: [uploadVersionEntityStub(), uploadVersionEntityStub()],
    maps: [MapDeviceEntityStub(), MapDeviceEntityStub()]
  } as DeviceEntity
};
