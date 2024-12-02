import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { KafkaContext, TcpContext } from "@nestjs/microservices";
import { CLS_ID, ClsService } from "nestjs-cls";
import { Observable } from "rxjs";

// import { storage, Store } from 'nestjs-pino/storage';


@Injectable()
export class AsyncContextMsInterceptor implements NestInterceptor {

  constructor(private readonly cls: ClsService){}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const input = context.switchToRpc();
    const msgContext = input.getContext()
   
    let traceId;
    if (msgContext instanceof KafkaContext){
      traceId = msgContext.getMessage()?.headers?.traceId;
    }else if(msgContext instanceof TcpContext) {
      let data  = input.getData();;
      traceId = data?.headers?.traceId;
      delete data?.headers?.traceId
    }

    this.cls.set(CLS_ID, traceId)

    // this._asyncStorage.enterWith(new AsyncContextStorage(...some data from headers));
    return next.handle();
  }
}
