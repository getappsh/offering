import { ApiProperty } from "@nestjs/swagger";


export class NewBugReportResDto {

  constructor(bugId: number, url: string){
    this.bugId = bugId;
    this.uploadLogsUrl = url;
  }

  @ApiProperty()
  bugId: number;


  @ApiProperty()
  uploadLogsUrl: string

  toString() {
    return JSON.stringify(this)
  }

}