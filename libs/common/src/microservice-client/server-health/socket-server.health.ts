import { Injectable, Logger } from "@nestjs/common";
import { HealthIndicator, HealthIndicatorResult, MicroserviceHealthIndicator } from "@nestjs/terminus";
import { IServerHealth } from "./server-health.interface";
import { TcpClientOptions, Transport } from "@nestjs/microservices";


@Injectable()
export class SocketServerHealthIndicator extends HealthIndicator implements IServerHealth{
    private readonly logger = new Logger(SocketServerHealthIndicator.name);
    private options: any
    private readonly healthKey = "server";
  
    constructor(private microservice: MicroserviceHealthIndicator){
      super();
    }

  setServer(server: {options: any}) {
    this.logger.debug("Set server");
    this.options = server.options;
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    return this.microservice.pingCheck<TcpClientOptions>(this.healthKey, {
      transport: Transport.TCP,
      options: this.options,
    });
  }


  async isAlive(): Promise<boolean> {
    const result = await this.isHealthy();
    if (result[this.healthKey].status === 'up') {
      return true
    }
    return false
  }

  isReady(): Promise<boolean> {
    return this.isAlive();
  }


}