import { Logger } from '@nestjs/common';
import { Consumer, ConsumerHeartbeatEvent, Producer } from '@nestjs/microservices/external/kafka.interface';


export class KafkaLivenessService{
  private readonly logger = new Logger(KafkaLivenessService.name)

  private ready = false;
  private alive = false;
  private lastHeartbeat: number;
  
  
  constructor(private readonly kafka: {consumer: Consumer, producer: Producer}){
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
    
    let consumer  = this.kafka.consumer;
    
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
