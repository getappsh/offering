import { ApiProperty } from "@nestjs/swagger";

export class ProjectConfigResDto {

  @ApiProperty({required: false})
  platforms: string[]

  @ApiProperty({required: false})
  formations: string[]

  @ApiProperty({required: false})
  categories: string[]

  @ApiProperty({required: false})
  operationsSystem: string[]

  toString(){
    return JSON.stringify(this);
  }

}