export * from './client.enum';
export * from './kafka/kafka-health.service'

import { ClientProvider } from "@nestjs/microservices";
import { MicroserviceModuleOptions } from "../microservice-client.interface";
import { getKafkaClientConfig } from "./kafka/kafka";
import { getSocketClientConfig } from "./socket/socket";
import { MSType } from './client.enum';

export function getClientConfig(options: MicroserviceModuleOptions, msType: MSType): ClientProvider{
  if (msType ==  MSType.KAFKA){
    return getKafkaClientConfig(options)
  
  }else if (msType == MSType.SOCKET) {
    return getSocketClientConfig(options.type);
  }
}