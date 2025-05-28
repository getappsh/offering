import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { MinioClientService } from './minio-client.service';

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  constructor(private readonly minioClient: MinioClientService) {
    super();
  }

  async isHealthy(key = 'minio'): Promise<HealthIndicatorResult> {
    try {
      // Try listing buckets as a basic health check
      await this.minioClient.listBuckets();

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        `${key} check failed`,
        this.getStatus(key, false, {
          message: error.message,
        }),
      );
    }
  }
}
