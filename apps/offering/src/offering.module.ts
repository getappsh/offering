import { Module } from '@nestjs/common';
import { OfferingController } from './offering.controller';
import { OfferingService } from './offering.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { ComponentOfferingEntity, DeviceEntity, MapOfferingEntity, ProjectEntity, ReleaseEntity, UploadVersionEntity } from '@app/common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ApmModule } from '@app/common/apm/apm.module';
import { MicroserviceModule, MicroserviceName, MicroserviceType } from '@app/common/microservice-client';
import { SafeCronModule } from '@app/common/safe-cron';
import { OfferingV2Service } from './offering-v2.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({httpCls: false, jsonLogger: process.env.LOGGER_FORMAT === 'JSON', name: "Offering"}),
    MicroserviceModule.register({
      name: MicroserviceName.DISCOVERY_SERVICE,
      type: MicroserviceType.DISCOVERY,
    }),
    ApmModule,
    DatabaseModule,
    TypeOrmModule.forFeature([UploadVersionEntity, ComponentOfferingEntity, MapOfferingEntity, DeviceEntity, ReleaseEntity, ProjectEntity]),
    SafeCronModule,
  ],
  controllers: [OfferingController],
  providers: [OfferingService, OfferingV2Service],
})
export class OfferingModule { }
