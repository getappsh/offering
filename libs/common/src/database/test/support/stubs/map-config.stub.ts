import { MapConfigEntity } from "@app/common/database/entities";

export const mapConfigEntityStub = (): MapConfigEntity => {
  return {
    mapMinInclusionInPercentages: 60
  } as MapConfigEntity
}