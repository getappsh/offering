import { DeviceEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class DevicePutDto {

  deviceId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string
  
  @ApiProperty({ required: false, description: "Set the unique given id or null to remove the exists uid." })
  @IsOptional()
  @IsNumber()
  orgUID: number | null

  toString() {
    return JSON.stringify(this);
  }

  static fromDeviceEntity(dE:DeviceEntity){
    const device = new DevicePutDto()
    device.deviceId = dE.ID
    device.name = dE.name

    if(dE.orgUID && dE.orgUID.UID){
      device.orgUID = dE.orgUID.UID
    }

    return device
  }
}