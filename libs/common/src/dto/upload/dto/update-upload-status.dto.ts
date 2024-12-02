import { UploadStatus } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"


export class UpdateUploadStatusDto{

    @ApiProperty({required: false})
    @IsString()
    @IsNotEmpty()
    catalogId: string;
   
    @IsEnum(UploadStatus)
    @ApiProperty({enum: UploadStatus})
    status: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    uploadToken: string

    toString(){
        return JSON.stringify(this)
    }

}