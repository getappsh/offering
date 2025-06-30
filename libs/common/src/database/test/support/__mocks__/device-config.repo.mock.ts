import { deviceConfigEntityAndroidStub } from "../stubs";

export const mockDeviceConfigRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([deviceConfigEntityAndroidStub()]),
    findOneBy: jest.fn().mockResolvedValue(deviceConfigEntityAndroidStub()),
  }
};
