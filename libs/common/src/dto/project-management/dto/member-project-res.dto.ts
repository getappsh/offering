import { MemberEntity, MemberProjectEntity, OperationSystemEntity, ProjectEntity, RoleInProject } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";

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


export class ProjectResDto {

  @ApiProperty({required: false})
  id: number;

  @ApiProperty({required: false})
  componentName: string;

  @ApiProperty({required: false})
  OS: string;

  @ApiProperty({required: false})
  platformType: string;

  @ApiProperty({required: false})
  formation: string;
  
  @ApiProperty({required: false})
  category: string;

  @ApiProperty({required: false})
  artifactType: string;

  @ApiProperty({required: false})
  tokens: string[]

  @ApiProperty({required: false})
  description: string;

  @ApiProperty({required: false, type: MemberResDto, isArray: true})
  members: MemberResDto[]

  fromProjectEntity(project: ProjectEntity){
    this.id = project.id;
    this.componentName = project.componentName;
    this.OS = project.OS?.name;
    this.platformType = project.platformType?.name;
    this.formation = project.formation?.name;
    this.category = project.category?.name;
    this.artifactType = project.artifactType;
    this.tokens = project.tokens;
    this.description = project.description;

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
  project: ProjectResDto;


  fromMemberProjectEntity(memberProject: MemberProjectEntity){
    this.member = new MemberResDto().fromMemberEntity(memberProject.member, memberProject.role);
    this.project = new ProjectResDto().fromProjectEntity(memberProject.project);
    return this;
  }

  toString(){
    return JSON.stringify(this);
  }

}


export class MemberProjectsResDto {

  @ApiProperty({required: false})
  member: MemberResDto;

  @ApiProperty({required: false, type: ProjectResDto, isArray: true})
  projects: ProjectResDto[];

  toString(){
    return JSON.stringify(this);
  }
}