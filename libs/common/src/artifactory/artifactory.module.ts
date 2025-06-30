import { Module } from "@nestjs/common";
import { WrapHttpModule } from './config/wrap-http/wrap-http.module';
import { ArtifactoryService } from './artifactory.service';

@Module({
  imports: [WrapHttpModule],
  providers: [ArtifactoryService],
  exports: [ArtifactoryService]
})
export class ArtifactoryModule { }