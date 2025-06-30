import { ProjectTokenEntity } from "@app/common/database/entities";

export const projectTokenEntityStub = (): ProjectTokenEntity => {
  return {
    id: 34,
    name: 'Generic Token',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InByb2plY3RJZCI6MiwicHJvamVjdE5hbWUiOiJHZXRNYXAtU0RLIn0sImlhdCI6MTczNjk1NDIxMSwiZXhwIjo0ODkyNzE0MjExfQ.h86GNlvB5a_ionH-IBrlZDbqSl4QuogjqYKRWSNTv0w',
    expirationDate: new Date('2022-12-31'),
    neverExpires: false,
    isActive: true

  } as ProjectTokenEntity
};
