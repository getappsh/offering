import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { S3, PutObjectCommand, GetObjectCommand, PutObjectRequest, } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import stream, { Readable } from 'stream';
import { Observable } from 'rxjs';
import { HashDto } from '../dto/delivery/dto/delivery-item.dto';
import { HashAlgorithmEnum } from '../database/entities/enums.entity';
import { createHash } from 'crypto';

@Injectable()
export class S3Service implements OnApplicationBootstrap {

  private readonly logger = new Logger(S3Service.name);

  private s3: S3;
  private bucketName: string;
  private endpoint: string

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get('S3_ENDPOINT_INTERNAL')

    this.s3 = new S3({
      forcePathStyle: this.endpoint ? true : false,
      endpoint: this.endpoint,
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
      },
    });

    this.bucketName = this.configService.get('BUCKET_NAME')
  }

  async createBucketIfNotExists(): Promise<void> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName });
      this.logger.debug(`Bucket "${this.bucketName}" already exists.`);
    } catch (error) {
      if (error["$metadata"]?.httpStatusCode === 404) {
        await this.s3.createBucket({ Bucket: this.bucketName });
        this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
      } else {        
        this.logger.error(`Failed to check/create bucket - error code: ${error["$metadata"]?.httpStatusCode}, mes: ${error.message}`);
      }
    }
  }

  async generatePresignedUrlForUpload(filename: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.configService.get('UPLOAD_URL_EXPIRE'),
    });
    return signedUrl;
  }

  async generatePresignedUrlForDownload(fileUrl: string): Promise<string> {

    if (!fileUrl) {
      return ''
    }
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileUrl,
    })

    if (!this.endpoint && fileUrl.includes("cache-public")) {
      return `https://${this.bucketName}.s3.amazonaws.com/${fileUrl}`
    }

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.configService.get('DOWNLOAD_URL_EXPIRE'),
    })

    if (this.endpoint && this.configService.get('S3_ENDPOINT_EXTERNAL')) {
      return signedUrl.replace(this.endpoint, this.configService.get('S3_ENDPOINT_EXTERNAL'));
    }

    return signedUrl;
  }

  uploadFile(filePath: string, objectKey: string) {
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: createReadStream(filePath)
    };

    return this.s3.putObject(params);
  }

  uploadFileFromStream(stream: stream.Readable, objectKey: string, hash?: HashDto): Observable<number> {
    const hexToBase64 = (hex: string): string => {
      return Buffer.from(hex, 'hex').toString('base64');
    }

    const getChecksum = (hash: HashDto) => {
      if (hash) {
        switch (hash.algorithm) {
          case HashAlgorithmEnum.SHA256Hex:
            // return { ChecksumSHA256: hash.hash }
            return { ChecksumSHA256: hexToBase64(hash.hash) }
          case HashAlgorithmEnum.SHA256Base64:
            return { ChecksumSHA256: hash.hash }
          default:
            return {}
        }
      }
    }

    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: stream,
      // ...getChecksum(hash)
    };
    const fileUpload = new Upload({
      client: this.s3,
      params: params,
    })

    return new Observable(observer => {
      fileUpload.on("httpUploadProgress", (progress: Progress) => {
        observer.next(progress.loaded);
      });

      fileUpload.done()
        .then(() => observer.complete())
        .catch(err => observer.error(err));
    })
  }

  async getHashForFile(objectKey: string) {
    this.logger.log(`Get head file ${objectKey} from s3 to calculate hash`);
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
    };
    const hash = createHash('sha256');
    try {
      const { Body } = await this.s3.send(new GetObjectCommand(params))
      if (!Body) {
        throw new Error('Empty response body');
      }

      const readable = Readable.from(Body as Readable);

      readable.on('data', (chunk) => {
        hash.update(chunk);
      });

      await new Promise((resolve, reject) => {
        readable.on('end', resolve);
        readable.on('error', reject);
      });

      return hash;
    } catch (err) {
      this.logger.error(`Error get head file ${objectKey} from s3, ${err}`);
      throw err
    }
  }

  async deleteFile(objectKey: string) {
    this.logger.log(`Delete file ${objectKey} from s3`);
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
    };
    try {
      const res = await this.s3.deleteObject(params);
      this.logger.verbose(`Delete file ${objectKey} from s3 res: ${JSON.stringify(res)}`)
      return
    } catch (error) {
      this.logger.error(`Error deleting file ${objectKey} from s3, ${error}`);
      throw error
    }
  }

  async getBucketObjList() {
    const data = await this.s3.listObjects({
      Bucket: this.bucketName
    })

    return data
  }

  onApplicationBootstrap() {
    this.createBucketIfNotExists()
  }
}