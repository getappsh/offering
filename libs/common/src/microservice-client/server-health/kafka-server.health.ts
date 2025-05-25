import { Injectable, Logger } from '@nestjs/common';
import { ServerKafka } from '@nestjs/microservices';
import { KafkaLivenessService } from '../clients/kafka/kafka-liveness.service';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { IServerHealth } from './server-health.interface';


@Injectable()
export class KafkaServerHealthIndicator extends HealthIndicator implements IServerHealth {
  private readonly logger = new Logger(KafkaServerHealthIndicator.name);
  private livenessService: KafkaLivenessService;

  setServer(server: ServerKafka) {
    this.logger.debug('Set server');
    this.livenessService = new KafkaLivenessService(server as any);
    
  }
 
  async isHealthy(): Promise<HealthIndicatorResult> {
    let status = false;
    if (this.livenessService) {
      status = await this.livenessService.isAlive();
    }

    return this.getStatus('server', status);
  }

  async isReady(): Promise<boolean> {
    let status = false;
    if (this.livenessService) {
      status = await this.livenessService.isReady();
    }
    return status;
  }

  async isAlive(): Promise<boolean> {
    let status = false;
    if (this.livenessService) {
      status = await this.livenessService.isAlive();
    }
    return status;
  }
}