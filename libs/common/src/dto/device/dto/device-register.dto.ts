import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeviceRegisterDto {

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({required: false})
  @IsString()
  @IsNotEmpty()
  userName: string;

  toString(){
    return JSON.stringify(this);
  }
}