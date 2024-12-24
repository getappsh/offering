import { projectEntityStub } from "@app/common/database/test/support/stubs"
import { CreateProjectDto } from "../dto/project.dto"

export const projectDtoStub = (): CreateProjectDto => {
  const eStub = projectEntityStub()

  return {
    name: eStub.name,
    description: eStub.description
  }
}
