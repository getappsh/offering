import { projectEntityStub, uploadVersionEntityStub } from "@app/common/database/test/support/stubs"
import { UploadArtifactDto } from "../dto/upload-artifact.tdo"

export const uploadArtifactDtoStub = (): UploadArtifactDto => {
    const eStub = uploadVersionEntityStub()
  
    return {
   
        platform: eStub.platform,
        component: eStub.component,
        formation: eStub.formation,
        OS: eStub.OS,
        version: eStub.version,
        releaseNotes: "release not of upload",
        size: "12312",
        url: "/url/to/the/artifact",
        artifactType: "artifactType",
        uploadToken: projectEntityStub().tokens[0]
    }
  }
  