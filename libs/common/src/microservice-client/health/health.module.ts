import { ClassProvider, DynamicModule, Module } from "@nestjs/common";
import { MSType } from "../clients";
import { HEALTH_SERVICE } from "./health.interface";
import { HealthController } from "./health.controller";
import { SocketHealthService } from "./socket-health.service";
import { KafkaHealthService } from "./kafka-health.service";
import { MicroserviceClient } from "../microservice-client.service";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";


@Module({
  providers: [],
  exports: []
})
export class HealthModule {
  static register(token: string): DynamicModule {
        
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_SERVICE,
          useFactory(client: MicroserviceClient) {
            if (client.isKafka()) {
              return new KafkaHealthService(client.getClient() as ClientKafka);
            } else {
              return new SocketHealthService(client.getClient() as ClientProxy);
            }
          },
          inject: [token]
        }
      ],
      exports: [HEALTH_SERVICE]
    }
  }

}