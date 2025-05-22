import { ClientKafka, ClientProxy } from "@nestjs/microservices";

export const HEALTH_SERVICE = 'HEALTH_SERVICE';

export interface IHealthService {
  isReady(): Promise<boolean>;
  isAlive(): Promise<boolean>;
}