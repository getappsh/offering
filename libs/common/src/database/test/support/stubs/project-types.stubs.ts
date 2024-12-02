import { CategoryEntity, FormationEntity, OperationSystemEntity, PlatformEntity } from "@app/common/database/entities";

export const categoryEntityStub = (): CategoryEntity => {
  return {
    name: 'missile'
  } as CategoryEntity
};

export const categoryInputStub = (): CategoryEntity => {
  return {
    name: 'tank'
  } as CategoryEntity
};

export const formationEntityStub = (): FormationEntity => {
  return {
    name: 'yatush'
  } as FormationEntity
};

export const operationSystemEntityStub = (): OperationSystemEntity => {
  return {
    name: 'windows'
  } as OperationSystemEntity
};

export const operationSystemInputStub = (): OperationSystemEntity => {
  return {
    name: 'linux'
  } as OperationSystemEntity
};

export const platformEntityStub = (): PlatformEntity => {
  return {
    name: 'Merkava'
  } as PlatformEntity
};