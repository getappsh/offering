import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { DiscoveryMessageV2Dto } from "../../discovery";
import { ComponentV2Dto } from "../../upload";
import { RestrictionDto } from "../../discovery/dto/restriction.dto";


export class DeviceComponentsOfferingDto {
  @ApiProperty({ type: () => [ComponentV2Dto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentV2Dto)
  offer: ComponentV2Dto[]


  @ApiProperty({ type: () => [ComponentV2Dto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentV2Dto)
  push: ComponentV2Dto[]


  @ApiProperty({ 
    type: () => [RestrictionDto],
    required: false,
    description: 'List of applicable restrictions for the device based on device ID, device type, OS, and other metadata'
  })
  @IsArray()
  @IsOptional()
  restrictions?: any[]


  toString() {
    return JSON.stringify(this)
  }

}


export class ComponentOfferingRequestDto {
  deviceId: string;
  platforms?: string[]
  formations?: string[]
  components?: string[]

  static fromDiscoveryMessageDto(dis: DiscoveryMessageV2Dto): ComponentOfferingRequestDto {
    const dto = new ComponentOfferingRequestDto();
    dto.deviceId = dis.id;

    dto.components = dis?.softwareData?.components?.map(comp => comp.catalogId);
    dto.formations = dis?.softwareData?.formations;
    dto.platforms = dis?.platform ? [dis.platform.token] : []
    return dto
  }
}