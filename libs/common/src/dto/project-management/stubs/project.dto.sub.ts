import { projectEntityStub } from "@app/common/database/test/support/stubs"
import { ProjectDto } from "../dto/project.dto"

export const projectDtoStub = (): ProjectDto => {
  const eStub = projectEntityStub()

  return {
    componentName: eStub.componentName,
    OS: eStub.OS.name,
    platformType: eStub.platformType.name,
    formation: eStub.formation.name,
    artifactType: eStub.artifactType,
    category: eStub.category.name,
    description: eStub.description,

  }
}
