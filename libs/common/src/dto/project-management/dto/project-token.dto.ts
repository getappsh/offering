import { ApiProperty, PartialType } from "@nestjs/swagger";
import { ProjectIdentifierParams } from "./project-identifier.dto";
import { IsBoolean, IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { ProjectTokenEntity } from "@app/common/database/entities";

export class ProjectTokenDto {

    @ApiProperty()
    id: number

    @ApiProperty()
    name: string

    @ApiProperty()
    token: string

    @ApiProperty({required: false})
    expirationDate?: Date

    @ApiProperty({default: false})
    neverExpires: boolean;

    @ApiProperty({default: true})
    isActive: boolean = true

    @ApiProperty()
    createdAt: Date

    static fromProjectTokenEntity(projectToken: ProjectTokenEntity){
        let token = new ProjectTokenDto();
        token.id = projectToken.id;
        token.name = projectToken.name;
        token.token = projectToken.token;
        token.expirationDate = projectToken.expirationDate;
        token.neverExpires = projectToken.neverExpires ?? false;
        token.isActive = projectToken.isActive;
        token.createdAt = projectToken.createdDate;
        return token
    }
    toString(){
        return JSON.stringify(this);
    }
}

export class CreateProjectTokenDto{

    projectIdentifier: string | number;
   
    projectId: number;
 
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string

    @ApiProperty({default: false})
    @IsBoolean()
    neverExpires: boolean;

    @ApiProperty({required: false, type: Date})
    @ValidateIf((o) => o.neverExpires === false)
    @IsDate()
    @Type(() => Date)
    expirationDate?: Date

    
    @ApiProperty({required: false})
    @IsBoolean()
    @IsOptional()
    isActive?: boolean

}

export class UpdateProjectTokenDto {
   
    projectIdentifier: string | number;
   
    projectId: number;

    id: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @IsOptional()
    name: string


    @ApiProperty({required: false})
    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}


export class TokenParams extends ProjectIdentifierParams {

    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    tokenId: number
}