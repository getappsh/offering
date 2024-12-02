import { DeviceEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";

export class DeviceResDto {
  @ApiProperty({required: false})
  ID: string;

  @ApiProperty({required: false})
  MAC: string;

  @ApiProperty({required: false})
  IP: string;

  @ApiProperty({required: false})
  OS: string;

  @ApiProperty({required: false})
  serialNumber: string;

  @ApiProperty({required: false})
  possibleBandwidth: string;

  @ApiProperty({required: false})
  availableStorage: string


  toString() {
    return JSON.stringify(this);
  }


  formEntity(device: DeviceEntity){
    this.ID = device.ID;
    this.MAC = device.MAC;
    this.IP = device.IP;
    this.OS = device.OS;
    this.serialNumber = device.serialNumber;
    this.possibleBandwidth = device.possibleBandwidth;
    this.availableStorage = device.availableStorage;

    return this;
  }
}