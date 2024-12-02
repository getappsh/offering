import { ProjectEntity } from "@app/common/database/entities";
import { uploadVersionEntityStub } from "./upload-version.stub";
import { categoryEntityStub, formationEntityStub, operationSystemEntityStub, platformEntityStub } from "./project-types.stubs";

export const projectEntityStub = (): ProjectEntity => {
  return {
    id: 34,
    componentName: uploadVersionEntityStub().component,
    OS: operationSystemEntityStub(),
    platformType: platformEntityStub(),
    formation: formationEntityStub(),
    category: categoryEntityStub(),
    artifactType: 'artifactType',
    description: "description",
    tokens: ['token-1', 'token-2']
  } as ProjectEntity
};
