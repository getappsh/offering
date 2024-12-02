import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { KafkaContext, TcpContext, TcpSocket } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ApmService as ElasticApmService} from 'nestjs-elastic-apm';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ApmInterceptor.name);

  constructor(private readonly apm: ElasticApmService){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return next.handle()
    }else{
      const input = context.switchToRpc();
      const msgContext = input.getContext()

      let topic: string
      if (msgContext instanceof KafkaContext){
        topic = msgContext.getTopic()
      }else if(msgContext instanceof TcpContext) {
        topic = msgContext.getPattern()
      }

      const tran = this.apm.startTransaction(topic)
      return next.handle().pipe(
        tap(() => {
          tran.end()
        })
      )
    }
  
  }
}