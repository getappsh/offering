import { DeviceMapStateEnum } from "@app/common/database/entities"
import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class InventoryUpdatesReqDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string


  @ApiProperty({
    type: "object", additionalProperties: {
      enum: Object.values(DeviceMapStateEnum),
      title: "map state",
    },
    example: { "mapId_1": DeviceMapStateEnum.DELIVERY, "mapId_2": DeviceMapStateEnum.IMPORT }
  })
  @IsNotEmpty()
  inventory: Record<string, DeviceMapStateEnum>

  toString(): string {
    return JSON.stringify(this)
  }
}

export class ProductDetails {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productType: string

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ingestionDate: Date;

  toString(): string {
    return JSON.stringify(this)
  }
}

export class InventoryDetailsDto {

  @ApiProperty({
    enum: DeviceMapStateEnum,
    description: "the state of the device for current device"
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DeviceMapStateEnum)
  status: DeviceMapStateEnum

  @ApiProperty({
    required: false,
    description: "Source of the map for this device — how the device obtained the map (e.g., 'generate', 'shared', 'storage', 'update', 'push')."
  })
  @IsOptional()
  @IsNotEmpty()
  src?: string

  @ApiProperty({ required: false, description: "The footprint of the map associated with the device." })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  footprint?: string

  @ApiProperty({ required: false, description: "The name of map (generated from file name)" })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string

  @ApiProperty({ required: false, description: "The name of the file associated with the map." })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fileName?: string

  toString(): string {
    return JSON.stringify(this)
  }
}

@ApiExtraModels(InventoryDetailsDto)
export class InventoryUpdatesReqV2Dto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string


  @ApiProperty({
    type: "object",
    additionalProperties: { $ref: getSchemaPath(InventoryDetailsDto) },
    example: { "mapId_1": { /* InventoryDetailsDto */ }, "mapId_2": { /* InventoryDetailsDto */ } }
  })
  @IsNotEmpty()
  inventory: Record<string, InventoryDetailsDto>

  toString(): string {
    return JSON.stringify(this)
  }
}