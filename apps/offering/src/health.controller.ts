import { IServerHealth, SERVER_HEALTH_SERVICE, healthRegistry } from "@app/common/microservice-client";
import { OfferingTopics } from "@app/common/microservice-client/topics";
import { Controller, Get, Inject, ServiceUnavailableException, Logger } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from "@nestjs/terminus";
import * as fs from 'fs';



@Controller('health')
export class HealthController {

    private readonly logger = new Logger(HealthController.name);
  

    constructor(
      private terminusHealth: HealthCheckService,
      @Inject(SERVER_HEALTH_SERVICE) private readonly serverHealthService: IServerHealth,
      private db: TypeOrmHealthIndicator,
    ){}
    

    @Get('ready')
    async readiness() {
      const ready =  await this.serverHealthService.isReady();
      if (ready){
        return "Ready"
      }else {
        throw new ServiceUnavailableException("Service Unavailable")
      }
    }
  
  
    @Get('live')
    async liveness() {
      const results = await this.serverHealthService.isAlive();
      if (results){
        return "Alive"
      }else {
        throw new ServiceUnavailableException("Service Unavailable")
      }
    }


    @HealthCheck()
    @Get()
    @MessagePattern(OfferingTopics.CHECK_HEALTH)
    health(){
      const version = this.readImageVersion()
      return this.terminusHealth.check([
        () => this.db.pingCheck('database'),
        () => this.serverHealthService.isHealthy(),
        ...healthRegistry
      ]).then(result => {
        result['version'] = version
        return result  
      });
    }

  private readImageVersion(){
    let version = 'unknown'
    try{
      version = fs.readFileSync('NEW_TAG.txt','utf8');
    }catch(error){
      this.logger.error(`Unable to read image version - error: ${error}`)
    }
    return version
  }
}