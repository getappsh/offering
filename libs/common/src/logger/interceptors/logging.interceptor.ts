import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { KafkaContext, TcpContext, TcpSocket } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }else{
      return this.logKafkaCall(context, next)
    }
  
  }
  private logKafkaCall(context: ExecutionContext, next: CallHandler): Observable<any> {
    const input = context.switchToRpc();
    const msgContext = input.getContext()
    const {headers, ...data} = input.getData()

    let topic: string
    if (msgContext instanceof KafkaContext){
      topic = msgContext.getTopic()
    }else if(msgContext instanceof TcpContext) {
      topic = msgContext.getPattern()
    }

    this.logger.verbose(JSON.stringify({topic, req: data}));

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        this.logger.verbose(
          JSON.stringify({
            topic,
            res: data,
            durations: `${Date.now() - now}ms`
          })
        )
      }),
    );
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url, body } = request;

    const baseMsg = {
      method,
      url,
    }

    this.logger.verbose(
      JSON.stringify({
        ...baseMsg,
        body
      })
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;

        this.logger.verbose(
          JSON.stringify({
            ...baseMsg,
            statusCode,
            body: data,
            durations: `${Date.now() - now}ms`
          })
        )
      }),
    );
  }

  
}
