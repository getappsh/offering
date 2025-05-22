import { Injectable, Logger } from "@nestjs/common";
import { IHealthService } from "./health.interface";
import { ClientProxy } from "@nestjs/microservices";


@Injectable()
export class SocketHealthService implements IHealthService {

  private readonly logger = new Logger(SocketHealthService.name)

  constructor(private readonly socketClient: ClientProxy) {
    this.logger.log('SocketHealthService created');
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

  isReady(): Promise<boolean> {
    return this.isConnected()
  }
  isAlive(): Promise<boolean> {
    return this.isConnected();
  }
}