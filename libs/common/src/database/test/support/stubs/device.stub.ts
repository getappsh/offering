import { DeviceEntity } from "@app/common/database/entities";
import { physicalDiscoveryDtoStub } from "@app/common/dto/discovery";
import { MapDeviceEntityStub } from "./device-map.stub";
import { deviceComponentEntityStub } from "./device-component.stub";

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
    components: [deviceComponentEntityStub(), deviceComponentEntityStub()],
    maps: [MapDeviceEntityStub(), MapDeviceEntityStub()]
  } as DeviceEntity
};
