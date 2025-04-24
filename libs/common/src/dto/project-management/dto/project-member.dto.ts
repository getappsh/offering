import { MemberProjectEntity, RoleInProject } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsEmail, IsEnum, IsNumber, IsBoolean } from "class-validator";
import { ProjectIdentifierParams } from "./project-identifier.dto";

export class AddMemberToProjectDto{
    projectIdentifier: string | number;
    
    projectId: number;

    @ApiProperty()
    @IsEmail()
    email: string;


    @ApiProperty({enum: RoleInProject, default: RoleInProject.PROJECT_MEMBER})
    @IsOptional()    
    @IsEnum(RoleInProject)
    role: RoleInProject = RoleInProject.PROJECT_MEMBER;

    toString(){
        return JSON.stringify(this)
    }
    
}

export class EditProjectMemberDto{
    
    projectIdentifier: string | number;

    memberId: number;

    projectId: number;


    @IsEnum(RoleInProject)
    @ApiProperty({enum: RoleInProject, default: RoleInProject.PROJECT_MEMBER})
    role: RoleInProject = RoleInProject.PROJECT_MEMBER;

    toString(){
        return JSON.stringify(this)
    }

}

export class ProjectMemberParams extends ProjectIdentifierParams{

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    memberId: number;
}


export class ProjectMemberPreferencesDto{

    projectIdentifier: string | number;

    projectId: number

    @ApiProperty({required: false})
    @IsOptional()
    @IsBoolean()
    pinned?: boolean


    static fromMemberEntity(memberProject: MemberProjectEntity): ProjectMemberPreferencesDto {
        const pref = new ProjectMemberPreferencesDto();
        pref.pinned = memberProject.pinned;
        return pref
    }
}
