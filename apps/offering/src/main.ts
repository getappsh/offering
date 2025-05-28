import * as dotenv from 'dotenv';
dotenv.config();
import apm from 'nestjs-elastic-apm';

import { NestFactory } from '@nestjs/core';
import { OfferingModule } from './offering.module';
import { MSType, MicroserviceName, MicroserviceType, getClientConfig } from '@app/common/microservice-client';
import { CustomRpcExceptionFilter } from './rpc-exception.filter';
import { GET_APP_LOGGER } from '@app/common/logger/logger.module';
import { SERVER_HEALTH_SERVICE } from '@app/common/microservice-client/server-health/server-health.interface';


async function bootstrap() {  
  const app = await NestFactory.create(OfferingModule, {
    bufferLogs: true
  });
  const ms = app.connectMicroservice(getClientConfig({type: MicroserviceType.OFFERING, name: MicroserviceName.OFFERING_SERVICE}, MSType[process.env.MICRO_SERVICE_TYPE]));

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
  
  await app.startAllMicroservices()
  app.select(OfferingModule)
     .get(SERVER_HEALTH_SERVICE)
     .setServer(ms['server'])

  app.listen(Number(process.env.HEALTH_PORT?? 4004));
}
bootstrap();
