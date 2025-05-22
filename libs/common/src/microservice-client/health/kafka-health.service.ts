import { Injectable, Logger } from '@nestjs/common';
import { ConsumerHeartbeatEvent } from 'kafkajs';
import { IHealthService } from './health.interface';
import { ClientKafka } from '@nestjs/microservices';


@Injectable()
export class KafkaHealthService implements IHealthService{
  private ready = false;
  private alive = false;
  private lastHeartbeat: number;
  
  private readonly logger = new Logger(KafkaHealthService.name)
  
  constructor(private readonly kafkaClient: ClientKafka){
    this.logger.log('KafkaHealthService created');

    this.listenToConsumerEvents();
    
    const interval = setInterval(() => {
        if (Date.now() - this.lastHeartbeat > 5000) {
          this.alive = false;
        }
    }, 5000);
  }

  private setHeartbeatEvent(event: ConsumerHeartbeatEvent){
    this.lastHeartbeat = event.timestamp;
    this.alive = true;
    this.ready = true;
  }

  private setFailedEvent(event: any){
    this.alive = false;
  }

  private async listenToConsumerEvents(){
    this.logger.log('Listening to consumer events');
    await this.kafkaClient.connect();
    
    let consumer  = this.kafkaClient['consumer'];
    
    consumer.on('consumer.heartbeat', event => this.setHeartbeatEvent(event));
    consumer.on('consumer.disconnect', event => this.setFailedEvent(event))
    consumer.on('consumer.stop', event => this.setFailedEvent(event));
    consumer.on('consumer.crash', event => this.setFailedEvent(event))
  }

  async isReady(): Promise<boolean>{
    return this.ready
  }
  async isAlive(): Promise<boolean>{
    return this.alive
  }
  

}
