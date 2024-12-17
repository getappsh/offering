import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SafeCronService } from "./safe-cron.service";
import { JobsEntity } from '@app/common/database/entities/map-updatesCronJob';



@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([JobsEntity]),
  ],
  providers: [SafeCronService],
  exports: [SafeCronService]
})
export class SafeCronModule { }
