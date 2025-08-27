import { ApiProperty } from "@nestjs/swagger";


export class NewBugReportResDto {

  constructor(bugId: number, url: string){
    this.bugId = bugId;
    this.uploadEndpoint = url;
  }

  @ApiProperty()
  bugId: number;


  @ApiProperty()
  uploadEndpoint: string

  toString() {
    return JSON.stringify(this)
  }

}