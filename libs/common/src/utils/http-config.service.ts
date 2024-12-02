import { API } from "@app/common/utils/paths";
import { HttpService } from "@nestjs/axios";
import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as https from 'https'


@Injectable({scope: Scope.REQUEST})
export class HttpConfigService {

  constructor(
    public readonly httpService: HttpService,
    private configService: ConfigService,
  ) { 
    const httpsAgent = new https.Agent({
      ca: fs.readFileSync(process.env.CA_CERT_PATH),
      cert: fs.readFileSync(process.env.SERVER_CERT_PATH),
      key: fs.readFileSync(process.env.SERVER_KEY_PATH),
      // rejectUnauthorized: false
    }
    )
    this.httpService.axiosRef.defaults.baseURL = `${this.configService.get("GETAPP_URL")}/${API}`;
    this.httpService.axiosRef.defaults.httpsAgent = httpsAgent
    this.httpService.axiosRef.defaults.headers = {...this.httpService.axiosRef.defaults.headers, "auth_type": "CC"} as any
  }
}