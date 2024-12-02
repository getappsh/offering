import { LoggerModule } from "nestjs-pino";
import { LoggerModuleOptions } from "./logger.interfaces";
import { ConsoleLogger, DynamicModule, LogLevel, Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AsyncContextMsInterceptor } from "@app/common/logger/interceptors/async-context-ms.interceptor";
import { LoggingInterceptor } from "@app/common/logger/interceptors/logging.interceptor";
import { GET_APP_LOGGER } from "./logger.module";
import { LoggerService } from "./logger.service";
import { ClsModule } from "nestjs-cls";
import { nanoid } from "nanoid";
import pino from 'pino';




export function createIMports(options: LoggerModuleOptions): DynamicModule[]{
  let imports: DynamicModule[] = []

  if (options.jsonLogger){
    imports.push(createPinoLogger(options.name))
  }

  if (options.httpCls){
    imports.push(
      ClsModule.forRoot({
        global: true,
        middleware: { 
          mount: true,
          generateId: true,
          idGenerator: (req: Request) =>
              req.headers['x-request-id'] ?? nanoid()
         },
      }),
    )

  }else{
    imports.push(
      ClsModule.forRoot({
        global: true,
        guard: { 
          mount: true,
          // generateId: true,
          // idGenerator: (context: ExecutionContext) => {
          //   const input = context.switchToRpc().getData();
          //   return input.headers.traceId
          // }
        }, 
      })
    )
    
  }
  return imports
}

export function createProviders(options: LoggerModuleOptions): Provider[]{
  let providers: Provider[] = []
  
  if(!options.httpCls){
    providers.push(
      {
        provide: APP_INTERCEPTOR,
        useClass: AsyncContextMsInterceptor,
      }
    )
  }

  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  })

  if(options.jsonLogger){
    providers.push({
      provide: GET_APP_LOGGER,
      useClass: LoggerService
      })
  }else{
    const logLevels: LogLevel[] = []
    switch (process.env.LOG_LEVEL) {
      default:
        logLevels.push('verbose');
      case 'debug':
        logLevels.push('debug');
      case 'log':
        logLevels.push('log');
      case 'warn':
        logLevels.push('warn')
      case 'error':
        logLevels.push('error')
    }

    const cLogger = new ConsoleLogger()
    cLogger.setLogLevels(logLevels)
    
    providers.push(
      {
        provide: GET_APP_LOGGER,
        useValue: cLogger
      }
    )
  }

  return providers
}


function createPinoLogger(name: string): DynamicModule{
  return LoggerModule.forRoot({
    pinoHttp: {
      level: process.env.LOG_LEVEL || 'trace',
      name: name,
      quietReqLogger: true,
      autoLogging: false,
      genReqId: () => undefined,
      base: {name: undefined},
      timestamp: pino.stdTimeFunctions.isoTime,
      // transport: {
      //   target: 'pino-pretty',
      //   options: {
      //     singleLine: true,
      //   }
      // }
    }
  })
}