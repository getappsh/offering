import { memberEntityStub } from "../stubs";

export const mockMemberRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(memberEntityStub()),
    save: jest.fn().mockResolvedValue(memberEntityStub()),
  }
};
