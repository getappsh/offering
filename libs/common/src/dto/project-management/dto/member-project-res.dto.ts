import { MemberEntity, MemberProjectEntity, RoleInProject } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectDto } from "./project.dto";

export class MemberResDto {

  @ApiProperty({required: false})
  id: number;

  @ApiProperty({required: false})
  firstName: string;

  @ApiProperty({required: false})
  lastName: string;

  @ApiProperty({required: false})
  email: string;

  @ApiProperty({ enum: RoleInProject })
  role: string;

  @ApiProperty({required: false, default:-1})
  defaultProject: number;

  fromMemberEntity(member: MemberEntity, role: string){
    this.id = member.id;
    this.email = member.email;
    this.firstName = member.firstName;
    this.lastName = member.lastName;
    this.role = role;

    return this;
  }

  toString(){
    return JSON.stringify(this);
  }

}


export class MemberProjectResDto{

  @ApiProperty({required: false})
  member: MemberResDto;

  @ApiProperty({required: false})
  project: ProjectDto;


  fromMemberProjectEntity(memberProject: MemberProjectEntity){
    this.member = new MemberResDto().fromMemberEntity(memberProject.member, memberProject.role);
    this.project = new ProjectDto().fromProjectEntity(memberProject.project);
    return this;
  }

  toString(){
    return JSON.stringify(this);
  }

}


export class MemberProjectsResDto {

  @ApiProperty({required: false})
  member: MemberResDto;

  @ApiProperty({required: false, type: ProjectDto, isArray: true})
  projects: ProjectDto[];

  toString(){
    return JSON.stringify(this);
  }
}