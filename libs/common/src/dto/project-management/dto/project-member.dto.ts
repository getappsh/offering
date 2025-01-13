import { RoleInProject } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsEmail, IsEnum, IsNumber } from "class-validator";

export class AddMemberToProjectDto{
    projectId: number;

    @ApiProperty()
    @IsEmail()
    email: string;


    @ApiProperty({enum: RoleInProject, default: RoleInProject.PROJECT_MEMBER})
    @IsOptional()    
    @IsEnum(RoleInProject)
    role: RoleInProject = RoleInProject.PROJECT_MEMBER;
}

export class EditProjectMemberDto{
    
    projectId: number;

    memberId: number;

    @IsEnum(RoleInProject)
    @ApiProperty({enum: RoleInProject, default: RoleInProject.PROJECT_MEMBER})
    role: RoleInProject = RoleInProject.PROJECT_MEMBER;

}

export class ProjectMemberParams{
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    projectId: number;


    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    memberId: number;
}