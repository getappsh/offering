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


  toString(){
    return JSON.stringify(this)
  }

}

export class FileUploadUrlDto{

  constructor(id: number, url: string, objectKey: string) {
    this.id = id
    this.url = url
    this.objectKey = objectKey
  }

  id: number

  url: string

  objectKey: string

  toString(){
    return JSON.stringify(this)
  }
}