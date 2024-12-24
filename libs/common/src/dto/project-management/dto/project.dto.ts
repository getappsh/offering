import { ApiProperty } from "@nestjs/swagger";
import { MemberResDto } from "./member-project-res.dto";
import { ProjectEntity } from "@app/common/database/entities";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { RegulationDto } from "./regulation.dto";


export class ProjectDto {

  @ApiProperty({required: false})
  id: number;

  @ApiProperty({required: false})
  name: string;

  @ApiProperty({required: false})
  description: string;
  
  @ApiProperty({required: false})
  tokens: string[]

  @ApiProperty({required: false})
  regulation: RegulationDto[]

  @ApiProperty({required: false, type: MemberResDto, isArray: true})
  members: MemberResDto[]

  fromProjectEntity(project: ProjectEntity){
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.tokens = project.tokens;
    
    if(project.regulations){
      this.regulation = project.regulations.map(regulation => new RegulationDto().fromRegulationEntity(regulation))
    }
  
    return this;
  }

  toString(){
    return JSON.stringify(this);
  }
}


export class CreateProjectDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({required: false})
    name: string;

    @IsString()
    @IsOptional()    
    @ApiProperty({required: false})
    description: string;
}