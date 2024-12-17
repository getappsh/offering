import { Module } from '@nestjs/common';
import { ProxyHttpConfigService } from './http-config.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  providers: [ProxyHttpConfigService],
  exports: [ProxyHttpConfigService],
})
export class HttpConfigModule { }
