import { deviceEntityStub } from "../stubs";

export const mockDeviceRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(deviceEntityStub()),
    create: jest.fn().mockReturnValue(deviceEntityStub()),
    save: jest.fn().mockResolvedValue(deviceEntityStub()),
  }
};