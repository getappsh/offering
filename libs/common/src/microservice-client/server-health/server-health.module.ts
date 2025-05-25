import { DynamicModule, Module } from "@nestjs/common";
import { KafkaServerHealthIndicator } from "./kafka-server.health";
import { SERVER_HEALTH_SERVICE } from "./server-health.interface";
import { SocketServerHealthIndicator } from "./socket-server.health";
import { TerminusModule } from "@nestjs/terminus";
import { MSType } from "../clients";


@Module({})
export class ServerHealthModule {
  static register(): DynamicModule {
    const module = {
      module: ServerHealthModule,
      imports: [],
      providers: [],
      exports: [SERVER_HEALTH_SERVICE]
    };

    if (MSType[process.env.MICRO_SERVICE_TYPE] === MSType.KAFKA) {
      module.providers = [{
        provide: SERVER_HEALTH_SERVICE,
        useClass: KafkaServerHealthIndicator
      }];
    }else {
      module.imports = [TerminusModule];
      module.providers = [{
        provide: SERVER_HEALTH_SERVICE,
        useClass: SocketServerHealthIndicator
      }];
    }

    return module
  }
}