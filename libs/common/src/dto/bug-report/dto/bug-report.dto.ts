import { ApiProperty } from "@nestjs/swagger";
import { DeviceDto } from "../../device/dto/device.dto";
import { BugReportEntity, FileUPloadStatusEnum } from "@app/common/database/entities";


export class BugReportDto {

  @ApiProperty()
  bugId: number;

  @ApiProperty({required: false})
  description: string;

  @ApiProperty()
  logsUrl: string;

  @ApiProperty()
  agentVersion: string;

  @ApiProperty({type: DeviceDto})
  device: DeviceDto;

  @ApiProperty()
  reportDate: Date

  @ApiProperty({required: false})
  startDate?: Date;

  @ApiProperty({required: false})
  endDate?: Date;

  @ApiProperty({required: false})
  logLevel?: string;

  @ApiProperty()
  isUploaded: boolean;

  static fromEntity(bugEntity: BugReportEntity, deviceDto: DeviceDto, url: string): BugReportDto{
    let bugDto = new BugReportDto();
    bugDto.bugId = bugEntity.id;
    bugDto.description = bugEntity.description;
    bugDto.reportDate = bugEntity.createdDate;
    bugDto.agentVersion = bugEntity.agentVersion;
    bugDto.startDate = bugEntity.startDate;
    bugDto.endDate = bugEntity.endDate; 
    bugDto.logLevel = bugEntity.logLevel;
    bugDto.isUploaded = bugEntity.fileUpload?.status === FileUPloadStatusEnum.UPLOADED || false;

    bugDto.logsUrl = url;
    bugDto.device = deviceDto;

    return bugDto
  }

  toString() {
    return JSON.stringify(this)
  }
}