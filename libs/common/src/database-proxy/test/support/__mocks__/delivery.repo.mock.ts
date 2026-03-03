import { deliveryEntityStub } from "../subs";

export const mockDeliveryRepo = () => {
  return {
    create: jest.fn().mockReturnValue(deliveryEntityStub()),
    save: jest.fn().mockResolvedValue(deliveryEntityStub()),
    update: jest.fn().mockResolvedValue(deliveryEntityStub()),
    findOneBy: jest.fn().mockResolvedValue(deliveryEntityStub()),
  }
};
