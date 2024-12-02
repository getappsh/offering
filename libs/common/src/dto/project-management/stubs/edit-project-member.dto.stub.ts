import { memberProjectEntityStub } from "@app/common/database/test/support/stubs"
import { EditProjectMemberDto } from "../dto/edit-project-member.dto"

export const editProjectMemberDtoStub = (): EditProjectMemberDto => {
  const eStub = memberProjectEntityStub()

  return {
    projectId: eStub.project.id,
    memberId: eStub.member.id,
    firstName: eStub.member.firstName,
    lastName: eStub.member.lastName,
    role: eStub.role
  }
}