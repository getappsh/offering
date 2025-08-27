import { MemberProjectEntity, RoleInProject } from "@app/common/database/entities";
import { projectEntityStub, memberEntityStub } from "./";


export const memberProjectEntityStub = (): MemberProjectEntity => {
  return {
    member: memberEntityStub(),
    project: projectEntityStub(),
    role: RoleInProject.PROJECT_MEMBER,

  } as MemberProjectEntity
};