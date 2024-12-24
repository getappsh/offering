import { IsValidStringFor } from "@app/common/validators"
import { Pattern } from "@app/common/validators/regex.validator";
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, IsSemVer } from "class-validator"


export class UploadArtifactDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    platform: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    component: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    formation: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({required: false})
    OS: string

    @IsSemVer()
    @IsNotEmpty()
    @ApiProperty({required: false})
    version: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({required: false})
    releaseNotes: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({required: false})
    size: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    url: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    artifactType: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    uploadToken: string

    toString(){
        return JSON.stringify(this)
    }

}