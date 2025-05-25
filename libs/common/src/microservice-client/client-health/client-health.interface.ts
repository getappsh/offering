import { HealthIndicatorResult } from "@nestjs/terminus";

export const CLIENT_HEALTH_SERVICE = 'CLIENT_HEALTH_SERVICE';

export interface IClientHealth {
  isHealthy(): Promise<HealthIndicatorResult>;
  isReady(): Promise<boolean>;
  isAlive(): Promise<boolean>;
}

export const healthRegistry = new Array<IClientHealth["isHealthy"]>();
