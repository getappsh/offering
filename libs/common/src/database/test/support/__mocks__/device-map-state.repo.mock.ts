import { deviceMapEntityStub } from "../stubs/device-map-state.stub";

export const mockDeviceMapStateRepo = () => {
  return {
    findOneBy: jest.fn().mockResolvedValue(deviceMapEntityStub()),
  }
};
