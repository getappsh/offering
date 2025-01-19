import { ServerKafka } from '@nestjs/microservices';
import { Consumer } from '@nestjs/microservices/external/kafka.interface';
import { KafkaHealthService } from './kafka-health.service';

export class KafkaStrategy extends ServerKafka {
  private readonly kafkaHealthService = KafkaHealthService.getInstance();

  async bindEvents(consumer: Consumer) {
    consumer.on('consumer.heartbeat', (event) => this.kafkaHealthService.setHeartbeatEvent(event));

    consumer.on('consumer.disconnect', event => this.kafkaHealthService.setFailedEvent(event))
    consumer.on('consumer.stop', event => this.kafkaHealthService.setFailedEvent(event));
    consumer.on('consumer.crash', event => this.kafkaHealthService.setFailedEvent(event))

    await super.bindEvents(consumer);
  }
}