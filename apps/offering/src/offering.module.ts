import { Module } from '@nestjs/common';
import { OfferingController } from './offering.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { ComponentOfferingEntity, DeviceEntity, OfferingTreePolicyEntity, DeviceTypeEntity, MapOfferingEntity, PlatformEntity, ProjectEntity, ReleaseEntity } from '@app/common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ApmModule } from '@app/common/apm/apm.module';
import { MicroserviceModule, MicroserviceName, MicroserviceType, KafkaHealthController } from '@app/common/microservice-client';
import { SafeCronModule } from '@app/common/safe-cron';
import { OfferingService } from './offering.service'
import { OfferingTreePolicyService } from './offering-tree-policy.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({ httpCls: false, jsonLogger: process.env.LOGGER_FORMAT === 'JSON', name: "Offering" }),
    MicroserviceModule.register({
      name: MicroserviceName.DISCOVERY_SERVICE,
      type: MicroserviceType.DISCOVERY,
      id: "offering"
    }),
    MicroserviceModule.register({
      name: MicroserviceName.UPLOAD_SERVICE,
      type: MicroserviceType.UPLOAD,
      id: "offering"
    }),
    ApmModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      ComponentOfferingEntity, MapOfferingEntity, DeviceEntity, ReleaseEntity,
      ProjectEntity, PlatformEntity, DeviceTypeEntity, OfferingTreePolicyEntity
    ]),
    SafeCronModule,
  ],
  controllers: [OfferingController, KafkaHealthController],
  providers: [OfferingService, OfferingTreePolicyService],
})
export class OfferingModule { }
