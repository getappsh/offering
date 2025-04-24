import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DeviceDto } from "./device.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentStateDto } from "../../discovery";
import { DeviceComponentEntity, DeviceComponentStateEnum } from "@app/common/database/entities";
import { Type } from "class-transformer";
import { ComponentV2Dto } from "../../upload";


export class SoftwareStateDto {
  
  @ApiProperty({ type: ComponentV2Dto})
  software: ComponentV2Dto;

  @ApiProperty({ required: false, enum: DeviceComponentStateEnum })
  state: DeviceComponentStateEnum;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  downloadDate?: Date;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deployDate?: Date;

  @ApiProperty({ isArray: true, type: ComponentV2Dto })
  offering: ComponentV2Dto[];

  @ApiProperty({ required: false})
  error: string;

  static fromDeviceComponentEntity(componentState: DeviceComponentEntity) {

    let softwareState = new SoftwareStateDto();
    softwareState.software = ComponentV2Dto.fromEntity(componentState.release);
    softwareState.state = componentState.state;
    softwareState.error = componentState?.error;
    softwareState.downloadDate = componentState?.downloadedAt;
    softwareState.deployDate = componentState?.deployedAt;

    return softwareState;
  }

  toString() {
    return JSON.stringify(this);
  }
  
}
export class DeviceSoftwareDto extends DeviceDto {

  @ApiProperty({ isArray: true, type: SoftwareStateDto })
  @IsNotEmpty()
  softwares: SoftwareStateDto[];


  static fromDeviceComponentsEntity(deviceComponents: DeviceComponentEntity[], device: DeviceDto): DeviceSoftwareDto {
    let deviceSoftware  = device as DeviceSoftwareDto;
    deviceSoftware.softwares = deviceComponents.filter(c => c.state != DeviceComponentStateEnum.OFFERING).map(c => SoftwareStateDto.fromDeviceComponentEntity(c));

    let offering = deviceComponents.filter(c => c.state == DeviceComponentStateEnum.OFFERING)
    for (let dto of deviceSoftware.softwares){
      let offer = offering.filter(off => off?.release?.project?.name == dto?.software?.projectName)
      if (offer){
        dto.offering = offer.map(off => ComponentV2Dto.fromEntity(off.release));
      }

    }
    return deviceSoftware
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class DeviceComponentStateDto extends ComponentStateDto{
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  downloadedAt?: Date;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deployedAt?: Date;


  static fromParent(parent: ComponentStateDto, deviceId: string){
    let dto = new DeviceComponentStateDto();
    Object.assign(dto, parent);
    dto.deviceId = deviceId
    return dto
  }

  toString(){
    return JSON.stringify(this);
  }
}

