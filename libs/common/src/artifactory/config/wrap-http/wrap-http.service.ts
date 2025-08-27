import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, of, Observable } from 'rxjs';

@Injectable()
export class WrapHttpService {
  constructor(private readonly httpService: HttpService, private configService: ConfigService) { }

  artifactoryWrapper(method: string, relativeUrl?: string, data?: any, config?: AxiosRequestConfig): Observable<any> {
    // const url = this.configService.get<string>("JFROG_BASE_URL") + this.configService.get<string>("JFROG_REPO") + relativeUrl
    const url = relativeUrl
    
    const auth = {
      auth: {
        username: this.configService.get<string>("JFROG_USER_NAME"),
        password: this.configService.get<string>("JFROG_PASSWORD")
      }
    }

    const headers = {}

    if (method == "get") {
      return this.httpService[method](url, { ...config, ...auth }).pipe(this.errorHandler());
    }
    return this.httpService[method](url, data, { ...config, ...auth }).pipe(this.errorHandler());
  }

  errorHandler() {
    return catchError((err: AxiosError) => {      
      return of(null);
    })
  }
}
