import { Controller, Get, Inject, Injectable, Logger } from "@nestjs/common";
import { HEALTH_SERVICE, IHealthService } from "./health.interface";


@Controller('health')
export class HealthController {


    constructor(
      @Inject(HEALTH_SERVICE) private readonly healthService: IHealthService
    ){}
    
    @Get('ready')
    healthReady() {
      return this.healthService.isReady();
    }
  
  
    @Get('live')
    healthLive() {
      return this.healthService.isAlive();
    }

}