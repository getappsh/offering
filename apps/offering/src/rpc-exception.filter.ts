import {
  ArgumentsHost,
  Catch,
  HttpException,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
* @class RpcExceptionFilter
* @classdesc - This class is a custom exception filter for NestJS to catch RPC exceptions
*/
@Catch()
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException | HttpException>
{
  private readonly logger = new Logger(CustomRpcExceptionFilter.name);

  catch(
    exception: RpcException | HttpException,
    host: ArgumentsHost,
  ): Observable<any> {
    const _data = host.switchToRpc().getData();
    const data = _data.value;
    const meta = _data.headers;
    const path = _data.topic;

    let error_data = {} as any;
    let status_code = 500;

    if (exception instanceof HttpException) {
      error_data = exception.getResponse();
      status_code = exception.getStatus();
    }

    const error = new Error();
    error.name = exception.name;
    error.message = JSON.stringify({
      // context: process.env.APP_NAME,
      code: status_code,
      message: exception.message,
      stack: exception.stack,
      error_data,
    });
    this.logger.error(exception.message)
    error.stack = exception.stack;
    return throwError(() => JSON.stringify(error));
  }
}