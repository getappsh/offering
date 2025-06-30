import { DynamicModule, Module } from "@nestjs/common";
import { createIMports, createProviders } from "./logger.providers";
import { LoggerModuleOptions } from "./logger.interfaces";

export const GET_APP_LOGGER = 'GET_APP_LOGGER'

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule{

    return {
      module: LoggerModule,
      imports: createIMports(options),
      providers: createProviders(options),
      exports: [GET_APP_LOGGER],
    }
  }
}