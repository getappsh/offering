import { discoveryMessageEntityStub } from "../stubs/discovery-message.stub";

export const mockDiscoveryMessageRepo = () => {
  return {
    save: jest.fn().mockResolvedValue(discoveryMessageEntityStub()),
  }
};
