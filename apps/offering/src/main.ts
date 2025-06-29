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

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    OfferingModule,
    {
      ...getClientConfig(
        {
          type: MicroserviceType.OFFERING,
          name: MicroserviceName.OFFERING_SERVICE
        },
        MSType[process.env.MICRO_SERVICE_TYPE],

      ),
      bufferLogs: true
    }
  );

  microservice.useLogger(microservice.get(GET_APP_LOGGER));
  microservice.useGlobalFilters(new CustomRpcExceptionFilter()); // For HTTP layer
  microservice.listen();

  const app = await NestFactory.create(OfferingModule, {
    bufferLogs: true
  });
  await app.listen(Number(process.env.HEALTH_PORT ?? 2999));
}

bootstrap()

