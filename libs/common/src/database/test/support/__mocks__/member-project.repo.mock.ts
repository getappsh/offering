import { memberProjectEntityStub } from "../stubs";

export const mockMemberProjectRepo = () => {
  return {
    findOne: jest.fn().mockResolvedValue(memberProjectEntityStub()),
    save: jest.fn().mockResolvedValue(memberProjectEntityStub()),
    remove: jest.fn().mockResolvedValue(memberProjectEntityStub()),
  }
};
