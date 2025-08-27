import { DeviceEntity } from "@app/common/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class DevicePutDto {

  deviceId: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    required: false,
    description: "Set the unique given id or null to remove the exists uid.",
    nullable: true,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  orgUID?: number | null;

  @ApiProperty({
    required: false,
    description: "Set group ID to associate the device with a specific group. set to null to remove the existing group association.",
    nullable: true,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  groupId?: number | null

  toString() {
    return JSON.stringify(this);
  }

  static fromDeviceEntity(dE: DeviceEntity) {
    const device = new DevicePutDto()
    device.deviceId = dE.ID
    device.name = dE.name

    if (dE.orgUID && dE.orgUID.UID) {
      device.orgUID = dE.orgUID.UID
      device.groupId = dE.orgUID.group?.id || null;
    }

    return device
  }
}