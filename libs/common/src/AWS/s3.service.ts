import { Injectable } from '@nestjs/common';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { S3, PutObjectCommand, GetObjectCommand, PutObjectRequest,  } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import stream from 'stream';
import { Observable } from 'rxjs';

@Injectable()
export class S3Service {

  private s3: S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get('BUCKET_NAME')
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

  async generatePresignedUrlForDownload(fileUrl: string):Promise<string>{
    if (!fileUrl){
      return ''
    }
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileUrl
    })

    if(fileUrl.includes("cache-public")){
        return `https://${this.bucketName}.s3.amazonaws.com/${fileUrl}`
    }

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.configService.get('DOWNLOAD_URL_EXPIRE'),
    }) 

    return signedUrl;
  }

  uploadFile(filePath: string, objectKey: string){  
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: createReadStream(filePath)
    };

    return this.s3.putObject(params);
  }

  uploadFileFromStream(stream: stream.Readable, objectKey: string): Observable<number> {      
    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: stream,
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
}