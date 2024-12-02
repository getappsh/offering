import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { CLS_ID, ClsService } from "nestjs-cls";
import { Observable } from "rxjs";

// import { storage, Store } from 'nestjs-pino/storage';


@Injectable()
export class AsyncContextMsInterceptor implements NestInterceptor {

  constructor(private readonly cls: ClsService){}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const input = context.switchToRpc().getData();
    this.cls.set(CLS_ID, input?.headers?.traceId)

    // this._asyncStorage.enterWith(new AsyncContextStorage(...some data from headers));
    return next.handle();
  }
}
