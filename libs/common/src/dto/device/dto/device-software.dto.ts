import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DeviceDto } from "./device.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentDto } from "../../discovery";
import { DeviceComponentEntity, DeviceComponentStateEnum, DeviceEntity, DiscoveryMessageEntity } from "@app/common/database/entities";
import { Type } from "class-transformer";


export class SoftwareStateDto {
  
  @ApiProperty({ type: ComponentDto})
  software: ComponentDto;

  @ApiProperty({ required: false, enum: DeviceComponentStateEnum })
  state: DeviceComponentStateEnum;


  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  downloadDate: Date;


  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deployDate: Date;

  @ApiProperty({ isArray: true, type: ComponentDto })
  offering: ComponentDto[];

  static fromDeviceComponentEntity(componentState: DeviceComponentEntity) {

    let softwareState = new SoftwareStateDto();
    softwareState.software = ComponentDto.fromUploadVersionEntity(componentState.component);
    softwareState.state = componentState.state;

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
      let offer = offering.filter(off => off.component.component == dto.software.name)
      if (offer){
        dto.offering = offer.map(off => ComponentDto.fromUploadVersionEntity(off.component));
      }

    }
    return deviceSoftware
  }

  toString() {
    return JSON.stringify(this);
  }
}

export class DeviceSoftwareStateDto{
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  catalogId: string;

  @ApiProperty({enum: DeviceComponentStateEnum })
  @IsEnum(DeviceComponentStateEnum)
  state: DeviceComponentStateEnum;

  toString(){
    return JSON.stringify(this);
  }
}

