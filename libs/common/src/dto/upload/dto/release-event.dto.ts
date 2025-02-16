import { ReleaseStatusEnum } from '@app/common/database/entities';


export enum ReleaseEventEnum {
  DELETED = 'deleted',
}

export type ReleaseEventType = ReleaseStatusEnum | ReleaseEventEnum

export class ReleaseChangedEventDto {

  constructor(
    public catalogId: string, 
    public event: ReleaseEventType) {}
}
