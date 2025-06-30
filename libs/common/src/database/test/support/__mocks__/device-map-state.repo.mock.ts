import { deviceMapEntityStub } from "../stubs/device-map-state.stub";

export const mockDeviceMapStateRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(deviceMapEntityStub()),
    findOneBy: jest.fn().mockResolvedValue(deviceMapEntityStub()),
    save: jest.fn().mockResolvedValue(deviceMapEntityStub()),

  }
};
