import { uploadVersionEntityStub } from "../stubs";

export const mockUploadVersionRepo = () => {
  return {
    save: jest.fn().mockResolvedValue(uploadVersionEntityStub()),
    update: jest.fn().mockResolvedValue(uploadVersionEntityStub()),
    findOne: jest.fn().mockResolvedValue(uploadVersionEntityStub()),
    findOneBy: jest.fn().mockResolvedValue(uploadVersionEntityStub()),
    find: jest.fn().mockResolvedValue([uploadVersionEntityStub(), uploadVersionEntityStub()])

  }
};