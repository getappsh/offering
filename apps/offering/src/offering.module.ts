import { Module } from '@nestjs/common';
import { OfferingController } from './offering.controller';
import { OfferingService } from './offering.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { MemberEntity, MemberProjectEntity, ProjectEntity, UploadVersionEntity, VersionPackagesEntity } from '@app/common/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from '@app/common/AWS/s3.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ApmModule } from '@app/common/apm/apm.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({httpCls: false, jsonLogger: process.env.LOGGER_FORMAT === 'JSON', name: "Offering"}),
    ApmModule,
    DatabaseModule,
    TypeOrmModule.forFeature([UploadVersionEntity, VersionPackagesEntity, ProjectEntity, MemberProjectEntity, MemberEntity]) 
  ],
  controllers: [OfferingController],
  providers: [OfferingService],
})
export class OfferingModule { }
