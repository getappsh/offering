import { categoryEntityStub, formationEntityStub, operationSystemEntityStub, platformEntityStub } from "../stubs";

export const mockCategoryRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([categoryEntityStub(), categoryEntityStub()]),
    findOne: jest.fn().mockImplementation(params => findOne(params, categoryEntityStub)),
    save: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
  }
};

export const mockFormationRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([formationEntityStub(), formationEntityStub()]),
    findOne: jest.fn().mockImplementation(params => findOne(params, formationEntityStub)),
    save: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
  }
};


export const mockOperationSystemRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([operationSystemEntityStub(), operationSystemEntityStub()]),
    findOne: jest.fn().mockImplementation(params => findOne(params, operationSystemEntityStub)),
    save: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
  }
};


export const mockPlatformRepo = () => {
  return {
    find: jest.fn().mockResolvedValue([platformEntityStub(), platformEntityStub()]),
    findOne: jest.fn().mockImplementation(params => findOne(params, platformEntityStub)),
    save: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
  }
};

const findOne = (params: any, entity: any) => {
  if (params.where && params.where.name === entity().name) {
    // Simulate behavior based on the input params
    return Promise.resolve(entity());
  } else {
    return Promise.resolve(null); // No matching entity found
  }
}

