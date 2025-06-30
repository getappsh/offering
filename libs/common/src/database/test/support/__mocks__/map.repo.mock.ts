import { expiredMap, mapEntityStub, notExpiredMap, withoutExpiredMap, withoutExpiredMapInProgress } from "../stubs/map.stub";

export const mockMapRepo = () => {
  return {
    // mapRepo members
    find: jest.fn().mockResolvedValue([mapEntityStub()]),
    findOne: jest.fn(),
    save: jest.fn().mockImplementation(map => map),

    // mapRepo implementations
    findOneBy: jest.fn().mockResolvedValue(mapEntityStub()),
    findOneByImportAttrsAndReturnExpiredMap: jest.fn().mockImplementation(_ => expiredMap()),
    findOneByImportAttrsAndReturnNotExpiredMap: jest.fn().mockImplementation(_ => notExpiredMap()),
    findOneByImportAttrsAndReturnWithoutExpiredMap: jest.fn().mockImplementation(_ => withoutExpiredMap()),
    findOneByImportAttrsAndReturnWithoutExpiredMapInProgress: jest.fn().mockImplementation(_ => withoutExpiredMapInProgress()),
  }
};

export interface mockMapRepoProps {
  find: any;
  findOne: typeof jest.fn;
  save: typeof jest.fn;
  findOneBy: typeof jest.fn;
  findOneByImportAttrsAndReturnExpiredMap: typeof jest.fn;
  findOneByImportAttrsAndReturnNotExpiredMap: typeof jest.fn;
  findOneByImportAttrsAndReturnWithoutExpiredMap: typeof jest.fn;
  findOneByImportAttrsAndReturnWithoutExpiredMapInProgress: typeof jest.fn;
}
