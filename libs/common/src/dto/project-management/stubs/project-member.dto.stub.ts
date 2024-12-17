import { memberProjectEntityStub } from "@app/common/database/test/support/stubs"
import { ProjectMemberDto } from "../dto/project-member.dto"

export const projectMemberDtoStub = (): ProjectMemberDto => {
  const eStub = memberProjectEntityStub()

  return {
    projectId: eStub.project.id,
    email: eStub.member.email,
    firstName: eStub.member.firstName,
    lastName: eStub.member.lastName,
    role: eStub.role
  }
}
