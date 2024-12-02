import { deployStatusEntityStub } from "../stubs";

export const mockDeployStatusRepo = () => {
  return {
    create: jest.fn().mockReturnValue(deployStatusEntityStub()),
    save: jest.fn().mockResolvedValue(deployStatusEntityStub()),
  }
};
