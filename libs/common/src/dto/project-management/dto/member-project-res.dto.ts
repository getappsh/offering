import { MemberEntity, MemberProjectEntity, MemberProjectStatusEnum, RoleInProject } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectDto } from "./project.dto";

export class MemberResDto {

  @ApiProperty({required: true})
  id: number;

  @ApiProperty({required: false})
  firstName: string;

  @ApiProperty({required: false})
  lastName: string;

  @ApiProperty({required: true})
  email: string;

  @ApiProperty({ enum: RoleInProject })
  role: string;

  @ApiProperty({required: true, enum: MemberProjectStatusEnum})
  status: MemberProjectStatusEnum

  @ApiProperty({required: false, default:-1})
  defaultProject: number;

  fromMemberEntity(member: MemberEntity, role: string, status?: MemberProjectStatusEnum) {
    this.id = member.id;
    this.email = member.email;
    this.firstName = member.firstName;
    this.lastName = member.lastName;
    this.role = role;
    this.status = status;

    return this;
  }

  fromMemberProjectEntity(memberProject: MemberProjectEntity): this {
    this.id = memberProject.member.id;
    this.email = memberProject.member.email;
    this.firstName = memberProject.member.firstName;
    this.lastName = memberProject.member.lastName;
    this.role = memberProject.role;
    this.status = memberProject.status;

    return this
  }

  getName(): string {
    if (!this.firstName || !this.lastName) {
      return this.email;
    }
    return `${this.firstName} ${this.lastName}`;
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

  @ApiProperty({required: false, type: ProjectDto})
  projects: ProjectDto[];
  
  @ApiProperty({required: false, type: ProjectDto})
  invitedProjects: ProjectDto[];

  toString(){
    return JSON.stringify(this);
  }
}