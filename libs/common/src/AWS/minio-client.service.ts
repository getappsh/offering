import { Injectable, OnApplicationBootstrap, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from 'minio';
import stream from 'stream';


@Injectable()
export class MinioClientService implements OnModuleInit{

  private readonly logger = new Logger(MinioClientService.name);
  private readonly client: Minio.Client;

  private readonly uploadUrlExpire = Number(this.configService.get<number>('UPLOAD_URL_EXPIRE'))
  private readonly downloadUrlExpire = Number(this.configService.get<number>('DOWNLOAD_URL_EXPIRE'))

  constructor(private configService: ConfigService){
    let endpoint = this.configService.get('S3_ENDPOINT_INTERNAL').replace(/^https?:\/\//, '');
    const accessKey = this.configService.get('ACCESS_KEY_ID');
    const secretKey = this.configService.get('SECRET_ACCESS_KEY');
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';

    let port: number | undefined;
    const portMatch = endpoint.match(/:(\d+)$/);
    if (portMatch) {
      port = parseInt(portMatch[1], 10);
      endpoint = endpoint.replace(/:\d+$/, '');
    }

    this.client = new Minio.Client({
      endPoint: endpoint,
      port: port,
      accessKey: accessKey,
      secretKey: secretKey,
      useSSL: useSSL
    })

  }
 
  listenBucketNotifications(bucketName: string, prefix: string = '', subfix: string = '', events: string[] = []): Minio.NotificationPoller {
    return this.client.listenBucketNotification(bucketName, prefix, subfix,  events);
  }

  generatePresignedUploadUrl(bucketName: string, objectKey: string, expression?: number): Promise<string> {
    return this.client.presignedPutObject(bucketName, objectKey, expression || this.uploadUrlExpire);
  }

  deleteObjects(bucketName: string, objectsKey: string[] | string): Promise<void> {
    const objects = Array.isArray(objectsKey) ? objectsKey : [objectsKey];
    return this.client.removeObjects(bucketName, objects);
  }

  generatePresignedDownloadUrl(bucketName: string, objectKey: string, expression?: number): Promise<string> {
    return this.client.presignedGetObject(bucketName, objectKey, expression || this.downloadUrlExpire);
  }

  getObject(bucketName: string, objectKey: string): Promise<stream.Readable> {
    return this.client.getObject(bucketName, objectKey);    
  }
  
  async getObjectStat(bucketName: string, objectKey: string): Promise<Minio.BucketItemStat | undefined> {
    try {
      return await this.client.statObject(bucketName, objectKey);
    } catch (err) {
      if (err.code === 'AccessDenied' || err.code === 'NotFound') {
        return undefined;
      } else {
        return Promise.reject(err);
      }
    }
  }

  bucketExists(bucketName: string): Promise<boolean>{
    return this.client.bucketExists(bucketName)
  }

  async onModuleInit() {
    const bucketName = this.configService.get('BUCKET_NAME');
    try{
      const exists = await this.bucketExists(bucketName);
      this.logger.debug(`Bucket "${bucketName}" exists: ${exists}`)
    }catch(err){
      this.logger.error(`Error checking bucket "${bucketName}": ${err}`)
    }
  }
}