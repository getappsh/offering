import { ProjectEntity, ProjectType } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { projectTokenEntityStub } from "./project-token.stub";

export const projectEntityStub = (): ProjectEntity => {
  return {
    id: 34,
    name: uploadVersionEntityStub().component,
    description: 'Project description',
    regulations : [],
    tokens: [projectTokenEntityStub()],
    projectType: ProjectType.FORMATION
  } as ProjectEntity
};
