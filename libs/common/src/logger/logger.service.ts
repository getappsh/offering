import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Logger, PinoLogger, Params, PARAMS_PROVIDER_TOKEN } from 'nestjs-pino';
import { LoggerService as LS } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  constructor(
    logger: PinoLogger,
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params,
    private readonly clsService: ClsService
  ) {
    super(logger, params);
  }
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(this.formateMessage(message),  ...optionalParams)
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(this.formateMessage(message),  ...optionalParams)
    
  }
  log(message: any, ...optionalParams: any[]) {   
    super.log(this.formateMessage(message),  ...optionalParams)
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(this.formateMessage(message),  ...optionalParams)
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(this.formateMessage(message), ...optionalParams)
  }

  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(this.formateMessage(message), ...optionalParams)
  }

  private formateMessage(message: any){
    return {message, traceId: this.clsService.getId()}
  }
}