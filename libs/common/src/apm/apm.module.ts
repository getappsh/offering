import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import {ApmModule as ElasticApmModule } from 'nestjs-elastic-apm';
import { ApmInterceptor } from "./apm.interceptor";


@Module({
    imports: [ElasticApmModule.register()],
    providers: [
      {provide: APP_INTERCEPTOR,
        useClass: ApmInterceptor,
      }
    ]
})
export class ApmModule{}