import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { DiscoveryMessageV2Dto } from "../../discovery";
import { ComponentV2Dto } from "../../upload";


export class DeviceComponentsOfferingDto {
  @ApiProperty({type: () => [ComponentV2Dto]})
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => ComponentV2Dto)
  offer: ComponentV2Dto[]


  @ApiProperty({type: () => [ComponentV2Dto]})
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => ComponentV2Dto)
  push: ComponentV2Dto[]

}


export class ComponentOfferingRequestDto {
  deviceId: string;
  platforms?: string[]
  formations?: string[]
  components?: string[]

  static fromDiscoveryMessageDto(dis: DiscoveryMessageV2Dto): ComponentOfferingRequestDto{
    const dto = new ComponentOfferingRequestDto();
    dto.deviceId = dis.general.physicalDevice.ID;

    dto.components = dis?.softwareData?.components.map(comp => comp.catalogId);
    dto.formations = dis?.softwareData?.formations;
    dto.platforms = dis?.softwareData?.platforms;
    return dto
  }
}