import {Injectable, NestInterceptor, ExecutionContext,CallHandler,} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { extractHeaders } from '../utils/context-helpers';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const headers = extractHeaders(context);
    const user = headers?.user;
    const projectToken = headers['x-project-token'];
    
    if (user) {
      this.clsService.set('user', user);
    }

    if (projectToken) {
      this.clsService.set('projectToken', projectToken);
    }
    
    return next.handle();
  }
}
