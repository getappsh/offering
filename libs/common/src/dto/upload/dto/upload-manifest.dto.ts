import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadManifestDto {
  @ApiProperty({ type: 'string', format: 'binary'})
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({required: false})
  uploadToken: string;
}