import { deliveryStatusEntityStub } from "../stubs";

export const mockDeliveryStatusRepo = () => {
  return {
    create: jest.fn().mockReturnValue(deliveryStatusEntityStub()),
    save: jest.fn().mockResolvedValue(deliveryStatusEntityStub()),
  }
};
