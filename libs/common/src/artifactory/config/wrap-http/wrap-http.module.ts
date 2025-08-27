import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WrapHttpService } from './wrap-http.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    HttpModule
  ],
  providers: [WrapHttpService],
  exports: [WrapHttpService]
})
export class WrapHttpModule {}
