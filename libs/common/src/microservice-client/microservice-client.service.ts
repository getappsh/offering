import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ClientKafka, ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Observable, map, timeout } from 'rxjs';
import { MicroserviceModuleOptions } from "./microservice-client.interface";
import { MSType, getClientConfig } from "./clients";
import { ConfigService } from "@nestjs/config";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ClsService } from "nestjs-cls";


@Injectable()
export class MicroserviceClient {
  private readonly logger = new Logger(MicroserviceClient.name);
  private client: ClientProxy | ClientKafka;
  private payloadVersion: string;

  constructor(
    private readonly options: MicroserviceModuleOptions,
    private configService: ConfigService,
    private readonly cls: ClsService
    ){
      const dplEnv = MSType[configService.get<string>('MICRO_SERVICE_TYPE')]
      const clientConfig = getClientConfig(options, dplEnv)

      this.client = ClientProxyFactory.create(clientConfig)
      this.payloadVersion = configService.get<string>('RPC_PAYLOAD_VERSION')
    }

  
  emit<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>{
    return this.client.emit(pattern, this.formatData(data));
  }

  send<TResult = any, TInput = any>(pattern: any, data: TInput, waitTime?: number): Observable<TResult>{
    waitTime = (waitTime) ? waitTime : parseInt(this.configService.get("MICROSERVICE_RESPONSE_WAIT_TIME"));
    return this.client.send(
      pattern, 
      this.formatData(data)
    ).pipe(
      timeout(waitTime)
    );
  }

  sendAndValidate<TResult extends Object>(topic: string, data: any, ClassConstructor: ClassConstructor<TResult>, waitTime?: number): Observable<Promise<TResult>>{
    waitTime = (waitTime) ? waitTime : parseInt(this.configService.get("MICROSERVICE_RESPONSE_WAIT_TIME"))
    return this.client.send(
        topic,
        this.formatData(data)
    ).pipe(
        timeout(waitTime),
        map(async res => {
            const validationObject = plainToInstance(ClassConstructor, res);
            const errors = await validate(validationObject);
            if (errors.length > 0) {
                this.logger.error(`Validation error for response of topic: ${topic}`);
                this.logger.verbose(`Response: ${JSON.stringify(res)}`)
                const constraints = errors.map((error) => Object.values(error.constraints ?? {})).flat();
                this.logger.verbose(`error list: ${errors}`);
                // throw new InternalServerErrorException(constraints);
            }
            return res;
        })
    )
  }

  private formatData(data: any) {
    return this.payloadVersion === "2" 
      ? this.formatDataV2(data) 
      : this.formatDataV1(data);
  }


  private formatDataV1(data: any) {
    const headers = { traceId: this.cls.getId() || "" };
    
    if (typeof data === 'string') {
      data = { stringValue: data };
    }
  
    return this.isKafka()
      ? { headers, value: JSON.stringify(data) }
      : { headers, ...data }; // WARNING messages of list ar not working, use V2
  }

  
  private formatDataV2(data: any) {
    const headers = { traceId: this.cls.getId() || "" };
    
    return {
      headers,
      value: typeof data !== 'string' && this.isKafka() 
        ? JSON.stringify(data) 
        : data
    };
  }

  isKafka(){
    return this.client instanceof ClientKafka
  }
  subscribeToResponseOf(topics: string[]): void{
    if (this.client instanceof ClientKafka) {
      topics.forEach((value) => {
        (this.client as ClientKafka).subscribeToResponseOf(value);
      });
    }
    
  }
  async connect():Promise<any>{
    try {
      return await this.client.connect();
    } catch (err) {
      return this.logger.error(err);
    }
  }
}