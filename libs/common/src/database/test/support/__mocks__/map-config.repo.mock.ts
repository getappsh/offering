import { mapConfigEntityStub } from "../stubs/map-config.stub";

export const mockMapConfigRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([mapConfigEntityStub()]),
  }
};
