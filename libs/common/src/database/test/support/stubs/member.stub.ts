import { MemberEntity } from "@app/common/database/entities";
import { projectEntityStub } from "./project.stub";

export const memberEntityStub = (): MemberEntity => {
  return {
    id: 92,
    firstName: 'Nicholas',
    lastName: 'Hart',
    email: 'NicholasHart@rhyta.com',
    defaultProject: projectEntityStub(),

  } as MemberEntity
};