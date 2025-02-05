import * as dotenv from 'dotenv';
dotenv.config();
import apm from 'nestjs-elastic-apm';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { OfferingModule } from './offering.module';
import { MSType, MicroserviceName, MicroserviceType, getClientConfig } from '@app/common/microservice-client';
import { CustomRpcExceptionFilter } from './rpc-exception.filter';
import { GET_APP_LOGGER } from '@app/common/logger/logger.module';


async function bootstrap() {  
  const app = await NestFactory.create(OfferingModule, {
    bufferLogs: true
  });
  app.connectMicroservice(getClientConfig({type: MicroserviceType.OFFERING, name: MicroserviceName.OFFERING_SERVICE}, MSType[process.env.MICRO_SERVICE_TYPE]));


  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   OfferingModule,
  //   {...getClientConfig(
  //     {
  //       type: MicroserviceType.OFFERING, 
  //       name: MicroserviceName.OFFERING_SERVICE
  //     }, 
  //     MSType[process.env.MICRO_SERVICE_TYPE]),
  //     bufferLogs: true
  //   }
  // );
  app.useLogger(app.get(GET_APP_LOGGER))
  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.startAllMicroservices()
  app.listen(Number(process.env.OFFERING_PORT?? 3004))
}
bootstrap();
