import { Injectable, Logger } from "@nestjs/common";
import { healthRegistry, IClientHealth } from "./client-health.interface";
import { ClientProxy } from "@nestjs/microservices";
import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";


@Injectable()
export class SocketClientHealthIndicator  extends HealthIndicator implements IClientHealth {

  private readonly logger = new Logger(SocketClientHealthIndicator.name)

  constructor(private readonly socketClient: ClientProxy, private readonly name: string) {
    super();
    this.logger.log('SocketClientHealthIndicator created');
    this.name = name.split('_')[0].toLowerCase();
    healthRegistry.push(this.isHealthy.bind(this));
    
  }

  private async isConnected(): Promise<boolean> {
    try{
      await this.socketClient.connect()
      this.socketClient.close()
      return true
    }catch(e){
      this.logger.error(`Error connecting to socket: ${e}`)
      return false
    }
    
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const connected = await this.isConnected()
    return this.getStatus(this.name, connected);
  }


  isReady(): Promise<boolean> {
    return this.isConnected()
  }
  isAlive(): Promise<boolean> {
    return this.isConnected();
  }
}