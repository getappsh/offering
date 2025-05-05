import { DocEntity, ProjectEntity } from "@app/common/database/entities";
import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional, IsInt, IsNotEmpty } from "class-validator";
import { ProjectIdentifierParams } from "./project-identifier.dto";
import { Type } from "class-transformer";

export class CreateDocDto {
  projectId: number;
  projectIdentifier: string | number

  @ApiProperty({ description: "The name of the documentation", example: "Project README" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Whether the documentation is an external URL", example: false })
  @IsBoolean()
  isUrl: boolean;

  @ApiProperty({ description: "The content of the README if isUrl is false", example: "# Project Documentation", required: false })
  @IsOptional()
  @IsString()
  readme?: string;

  @ApiProperty({ description: "The URL to the external documentation if isUrl is true", example: "https://example.com/docs", required: false })
  @IsOptional()
  @IsString()
  docUrl?: string;

  toProjectEntity(): DocEntity {
    const doc = new DocEntity()
    doc.name = this.name
    doc.isUrl = this.isUrl
    doc.readme = this.readme
    doc.docUrl = this.docUrl
    doc.project = {id: this.projectId} as ProjectEntity
    return doc
  }

  toString(){
    return JSON.stringify(this)
  }
}


export class UpdateDocDto extends PartialType(CreateDocDto) {
  projectId: number;
  projectIdentifier: string | number
  id: number

}

export class DocDto extends OmitType(CreateDocDto, ['projectId', 'projectIdentifier'] as const) {
  @ApiProperty({ description: "Unique identifier of the documentation", example: 1 })
  id: number;

  @ApiProperty({ description: "Timestamp when the doc was created", example: "2025-02-03T12:34:56Z" })
  createdAt: Date;

  @ApiProperty({ description: "Timestamp when the doc was last updated", example: "2025-02-03T12:34:56Z" })
  updatedAt: Date;


  static fromDocEntity(doc: DocEntity): DocDto{
    const dto = new DocDto()
    dto.id = doc.id,
    dto.name = doc.name,
    dto.isUrl = doc.isUrl,
    dto.readme = doc.readme,
    dto.docUrl = doc.docUrl,
    dto.createdAt = doc.createdDate,
    dto.updatedAt = doc.lastUpdatedDate

    return dto    
  }
}

export class DocsParams extends ProjectIdentifierParams {

    @ApiProperty({ description: "Unique identifier of the documentation", example: 1 })
    @IsInt()
    @Type(() => Number)
    id: number
}