import { Injectable, Logger } from '@nestjs/common';
import { healthRegistry, IClientHealth } from './client-health.interface';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaLivenessService } from '../clients/kafka/kafka-liveness.service';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';


@Injectable()
export class KafkaClientHealthIndicator  extends HealthIndicator implements IClientHealth{
  private livenessService: KafkaLivenessService = null;

  private readonly logger = new Logger(KafkaClientHealthIndicator.name)
  
  constructor(private readonly kafkaClient: ClientKafka, private name: string) {
    super();
    this.name = name.split('_')[0].toLowerCase();
    this.logger.log('KafkaClientHealthIndicator created');

    healthRegistry.push(this.isHealthy.bind(this));

    this.listenToConsumerEvents();
  }

  private async listenToConsumerEvents(){
    this.logger.log('Listening to consumer events');
    await this.kafkaClient.connect();
    this.livenessService = new KafkaLivenessService(this.kafkaClient as any);
  }


  async isHealthy(): Promise<HealthIndicatorResult> {
    let status = false;
    if (this.livenessService) {
      status = await this.livenessService.isAlive();
    }

    return this.getStatus(this.name, status);
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
