import { DiscoveryMessageDto } from "../dto/discovery-message.dto";
import { generalDiscoveryDtoStub } from "./discovery-general.dto.stub";
import { discoverySoftwareDtoStub } from "./discovery-software.dto.stub";

export const discoveryMessageDtoStub = (): DiscoveryMessageDto  => {
  return {
    general: generalDiscoveryDtoStub(),
    softwareData: discoverySoftwareDtoStub(),
    mapData: null
  }as DiscoveryMessageDto
}