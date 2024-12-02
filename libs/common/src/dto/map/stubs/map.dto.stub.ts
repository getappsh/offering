import { mapEntityStub } from "@app/common/database/test/support/stubs/map.stub"
import { MapDto } from "../dto/map.dto";

export const mapDtoStub = (): MapDto => {
  const eStub = mapEntityStub()
  return MapDto.fromMapEntity(eStub);
}
