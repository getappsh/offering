import { DiscoveryMessageEntity } from "@app/common/database/entities";
import { personalDiscoveryDtoStub, situationalDiscoveryDtoStub } from "@app/common/dto/discovery";
import { discoverySoftwareDtoStub } from "@app/common/dto/discovery";
import { deviceEntityStub } from "./device.stub";

export const discoveryMessageEntityStub = (): DiscoveryMessageEntity => {
  return {
    device: deviceEntityStub(),
    personalDevice: personalDiscoveryDtoStub(),
    situationalDevice: situationalDiscoveryDtoStub(),
    discoveryData: discoverySoftwareDtoStub(),
  } as DiscoveryMessageEntity

};