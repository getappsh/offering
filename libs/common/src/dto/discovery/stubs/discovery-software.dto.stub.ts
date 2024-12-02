import { uploadVersionEntityStub } from "@app/common/database/test/support/stubs"
import { ComponentDto, DiscoverySoftwareDto, PlatformDto } from "../dto/discovery-software.dto"

export const componentDtoStub = (): ComponentDto => {
  const eStub = uploadVersionEntityStub()

  return {
  catalogId: eStub.catalogId,
  name: eStub.component,
  versionNumber: eStub.version,
  releaseNotes: "Some release notes",
  virtualSize: eStub.virtualSize,
  category: "category",
  baseVersion: eStub.baseVersion,
  prevVersion: eStub.prevVersion,
  subComponents: []
  }
}

export const platformDtoStub = (): PlatformDto => {
  const eStub = uploadVersionEntityStub()
  return {
    name: eStub.platform,
    platformNumber: 'plf_num-343',
    virtualSize: 89239,
    components: [componentDtoStub(), componentDtoStub()],
  }
}

export const discoverySoftwareDtoStub = (): DiscoverySoftwareDto => {
  const eStub = uploadVersionEntityStub()
  return {
    formation: eStub.formation,
    platform: platformDtoStub()
  }
}
