import { Controller, Get, Logger } from "@nestjs/common";
import { KafkaHealthService } from "./kafka-health.service";


@Controller('health')
export class KafkaHealthController {
    private readonly kafkaHealthService = KafkaHealthService.getInstance();
    private readonly logger = new Logger(KafkaHealthController.name);


    constructor(){}
    
    @Get('ready')
    healthReady() {
      return this.kafkaHealthService.isReady();
    }
  
  
    @Get('live')
    healthLive() {
      return this.kafkaHealthService.isAlive();
    }

}