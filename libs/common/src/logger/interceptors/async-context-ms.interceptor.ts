import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { KafkaContext, TcpContext } from "@nestjs/microservices";
import { CLS_ID, ClsService } from "nestjs-cls";
import { map, Observable } from "rxjs";

// import { storage, Store } from 'nestjs-pino/storage';


@Injectable()
export class AsyncContextMsInterceptor implements NestInterceptor {

  constructor(private readonly cls: ClsService){}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const input = context.switchToRpc();
    const msgContext = input.getContext()
   
    let traceId;
    const isKafka = msgContext instanceof KafkaContext
    if (isKafka){
      traceId = msgContext.getMessage()?.headers?.traceId;
    }else if(msgContext instanceof TcpContext) {
      let data  = input.getData();;
      traceId = data?.headers?.traceId;
      delete data?.headers?.traceId
    }

    this.cls.set(CLS_ID, traceId)

    // this._asyncStorage.enterWith(new AsyncContextStorage(...some data from headers));
    return next.handle().pipe(
      map((data) => {
        return typeof data !== 'string' && isKafka ? JSON.stringify(data) : data
      })
    );
  }
}
