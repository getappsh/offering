import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFileUploadUrlDto{
  userId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string

  @ApiProperty({required: false, description: 'Optional object key without the filename to be used in the bucket'})
  @IsString()
  @IsOptional()
  objectKey?: string


}

export class FileUploadUrlDto{

  constructor(url: string, objectKey: string) {
    this.url = url
    this.objectKey = objectKey
  }

  url: string

  objectKey: string
}