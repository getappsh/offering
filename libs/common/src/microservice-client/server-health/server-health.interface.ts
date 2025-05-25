import { HealthIndicatorResult } from "@nestjs/terminus";


export const SERVER_HEALTH_SERVICE = 'SERVER_HEALTH_SERVICE';

export interface IServerHealth {

  setServer(server: any);
  isHealthy(): Promise<HealthIndicatorResult>;
  isReady(): Promise<boolean>;
  isAlive(): Promise<boolean>;
}