import { AppError } from '@app/common/dto/error';
import { ArgumentsHost, Catch, HttpException, Logger, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
* @class RpcExceptionFilter
* @classdesc - This class is a custom exception filter for NestJS to catch RPC exceptions
*/
@Catch()
export class CustomRpcExceptionFilter implements RpcExceptionFilter<RpcException | HttpException | AppError> {
  private readonly logger = new Logger(CustomRpcExceptionFilter.name);

  catch(exception: RpcException | HttpException | AppError, host: ArgumentsHost): Observable<any> {
    const _data = host.switchToRpc().getData();
    const data = _data?.value;
    const meta = _data?.headers;
    const path = _data?.topic;

    let status_code = 500;
    let error_data: any = {};

    if (exception instanceof HttpException) {
      error_data = exception.getResponse();
      status_code = exception.getStatus();
    }

    if (exception instanceof AppError) {
      error_data = {
        errorCode: exception.errorCode,
        message: exception.message,
      };
      status_code = exception.statusCode || 500;
    }

    const error = new Error();
    error.name = exception.name;
    error.message = JSON.stringify({
      code: status_code,
      message: exception.message,
      errorCode: (exception as any).errorCode, // Safe cast for AppError
      stack: exception.stack,
      error_data,
    });

    this.logger.error(exception.message);
    error.stack = exception.stack;

    return throwError(() => JSON.stringify(error));
  }
}
