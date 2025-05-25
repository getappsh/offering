import { ClassProvider, DynamicModule, Module } from "@nestjs/common";
import { MSType } from "../clients";
import { CLIENT_HEALTH_SERVICE } from "./client-health.interface";
import { SocketClientHealthIndicator } from "./socket-client.health";
import { KafkaClientHealthIndicator } from "./kafka-client.health";
import { MicroserviceClient } from "../microservice-client.service";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";




@Module({})
export class ClientHealthModule {
  static register(token: string): DynamicModule {
        
    return {
      module: ClientHealthModule,
      providers: [
        {
          provide: CLIENT_HEALTH_SERVICE,
          useFactory(client: MicroserviceClient) {
            let service: SocketClientHealthIndicator | KafkaClientHealthIndicator
            if (client.isKafka()) {
              service = new KafkaClientHealthIndicator(client.getClient() as ClientKafka, token);
            } else {
              service = new SocketClientHealthIndicator(client.getClient() as ClientProxy, token);
            }
            return service
          },
          inject: [token]
        }
      ],
      exports: [CLIENT_HEALTH_SERVICE]
    }
  }

}