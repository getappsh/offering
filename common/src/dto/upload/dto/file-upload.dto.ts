import { FileUPloadStatusEnum } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, NotContains } from "class-validator";

export class CreateFileUploadUrlDto{
  userId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ', { message: 'Filename cannot contain spaces' })
  fileName: string

  @ApiProperty({required: false, description: 'Optional object key without the filename to be used in the bucket'})
  @IsString()
  @IsOptional()
  objectKey?: string

  @ApiProperty({ required: false, description: 'Whether to trigger an SBOM scan for this file after upload. Defaults to true.', default: true })
  @IsBoolean()
  @IsOptional()
  enableSbomScan?: boolean;


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

export class UpdateFileUploadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  objectKey: string;

  @ApiProperty({ required: false , enum: FileUPloadStatusEnum})
  @IsOptional()
  status?: FileUPloadStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  contentType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  uploadAt?: Date;
}