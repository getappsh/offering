import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OfferingTopics, OfferingTopicsEmit } from '@app/common/microservice-client/topics';
import { ComponentOfferingRequestDto, PushOfferingDto } from '@app/common/dto/offering';
import { ItemTypeEnum } from '@app/common/database/entities';
import { ReleaseChangedEventDto } from '@app/common/dto/upload';
import { DeviceComponentStateDto } from '@app/common/dto/device/dto/device-software.dto';
import { DeviceMapStateDto } from '@app/common/dto/device';
import { RpcPayload } from '@app/common/microservice-client';
import { OfferingService } from './offering.service';

@Controller()
export class OfferingController {

  private readonly logger = new Logger(OfferingController.name);

  constructor(
    private readonly offeringService: OfferingService
  ) {}
  

  @MessagePattern(OfferingTopics.GET_OFFER_OF_COMP)
  getOfferOfComp(@RpcPayload("stringValue") catalogId: string){    
    this.logger.debug(`get offering for comp: ${catalogId}`)
    return this.offeringService.getOfferOfComp(catalogId)
  }


  @MessagePattern(OfferingTopics.DEVICE_COMPONENT_OFFERING)
  getDeviceComponentOfferingV2(@RpcPayload() dto: ComponentOfferingRequestDto){
    return this.offeringService.getDeviceComponentOffering(dto);
  }

  @MessagePattern(OfferingTopics.DEVICE_MAP_OFFERING)
  getDeviceMapOffering(@RpcPayload("stringValue") deviceId: string){  
    this.logger.debug(`get map offering for device: ${deviceId}`)  
    return this.offeringService.getDeviceMapOffering(deviceId)
  }

  @EventPattern(OfferingTopicsEmit.OFFERING_PUSH)
  pushOffering(@RpcPayload() po: PushOfferingDto){
    this.logger.log(`Push offering of catalogId: ${po.catalogId}, type: ${po.itemType}`);
    if(po.itemType == ItemTypeEnum.SOFTWARE){
      this.offeringService.pushSoftwareOffering(po);
    }else if (po.itemType == ItemTypeEnum.MAP){
      this.offeringService.pushMapOffering(po);
    }
  }

  @EventPattern(OfferingTopicsEmit.RELEASE_CHANGED_EVENT)
  releaseChangedEvent(@RpcPayload() event: ReleaseChangedEventDto){
    this.logger.log(`Release changed event for catalogId: ${event.catalogId}, event: ${event.event}`);
    this.offeringService.releaseChangedEvent(event);
  }

  @EventPattern(OfferingTopicsEmit.DEVICE_SOFTWARE_EVENT)
  deviceSoftwareEvent(@RpcPayload() event: DeviceComponentStateDto){
    this.logger.log(`Device software event`);
    this.offeringService.deviceSoftwareEvent(event);
  }

  @EventPattern(OfferingTopicsEmit.DEVICE_MAP_EVENT)
  deviceMapEvent(@RpcPayload() event: DeviceMapStateDto){
    this.logger.log(`Device map event`);
    this.offeringService.deviceMapEvent(event);
  }
}
