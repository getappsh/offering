import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class ProjectDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    componentName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    OS: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    platformType: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    formation: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    artifactType: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    category: string;

    @IsString()
    @IsOptional()    
    @ApiProperty({required: false})
    description: string;
}