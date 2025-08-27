import { DeviceConfigEntity } from "@app/common/database/entities";

export const deviceConfigEntityAndroidStub = (): DeviceConfigEntity => {
  return {
    group: 'android',
    data: {
      mapMinInclusionInPercentages: 60
    }
  } as DeviceConfigEntity
}