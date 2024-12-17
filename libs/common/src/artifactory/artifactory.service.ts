import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { WrapHttpService } from './config/wrap-http/wrap-http.service';
import { Observable, of } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ArtifactoryService {
  constructor(private readonly wrapHttp: WrapHttpService) { }

  connect(): Observable<AxiosResponse<any, any> | unknown> {
    return this.wrapHttp.artifactoryWrapper("get")

  }

  getArtifacts(relativesUrl: string): Observable<AxiosResponse<any, any> | unknown> {
    return this.wrapHttp.artifactoryWrapper("get", relativesUrl, null, { headers: { responseType: "stream" } })

  }
}
