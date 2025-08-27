import { ConfigurableModuleBuilder } from "@nestjs/common";
import { MicroserviceModuleOptions } from "./microservice-client.interface";


export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<MicroserviceModuleOptions>().build();