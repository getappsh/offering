import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ValidateIf, IsString, IsNotEmpty } from "class-validator";

export class ProjectIdentifierParams{

  @ApiProperty({type: String, description: 'Project identifier (ID or name)'})
  @ValidateIf((o) => typeof o.projectIdentifier === 'string')
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const isNum = (num) => Number.isFinite ? Number.isFinite(+num) : isFinite(+num)
    
    if (isNum(value)) {
      return parseInt(value, 10);
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }

    throw new BadRequestException('Invalid project identifier');
  })
  projectIdentifier: string |number;
  

  projectId: number
}