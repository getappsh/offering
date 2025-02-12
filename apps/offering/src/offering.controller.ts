import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OfferingService } from './offering.service';
import { OfferingTopics, OfferingTopicsEmit } from '@app/common/microservice-client/topics';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';
import { ComponentOfferingRequestDto, PushOfferingDto } from '@app/common/dto/offering';
import { ItemTypeEnum } from '@app/common/database/entities';
import { UploadEventDto } from '@app/common/dto/upload';
import { DeviceSoftwareStateDto } from '@app/common/dto/device/dto/device-software.dto';
import { DeviceMapStateDto } from '@app/common/dto/device';
import { RpcPayload } from '@app/common/microservice-client';
import * as fs from 'fs';
import { OfferingV2Service } from './offering-v2.service';

@Controller()
export class OfferingController {

  private readonly logger = new Logger(OfferingController.name);

  constructor(
    private readonly offeringService: OfferingService,
    private readonly offeringV2Service: OfferingV2Service
  ) {}
  

  @MessagePattern(OfferingTopics.GET_OFFER_OF_COMP)
  getOfferOfComp(@RpcPayload("stringValue") catalogId: string){    
    this.logger.debug(`get offering for comp: ${catalogId}`)
    return this.offeringService.getOfferOfComp(catalogId)
  }

  @MessagePattern(OfferingTopics.CHECK_UPDATES)
  checkUpdates(@RpcPayload() data: DiscoveryMessageDto){    
    return this.offeringService.checkUpdates(data)
  }


  @MessagePattern(OfferingTopics.DEVICE_COMPONENT_OFFERING)
  getDeviceComponentOffering(@RpcPayload("stringValue") deviceId: string){  
    this.logger.debug(`get component offering for device: ${deviceId}`)  
    return this.offeringService.getDeviceComponentOffering(deviceId)
  }

  @MessagePattern(OfferingTopics.DEVICE_COMPONENT_OFFERING_V2)
  getDeviceComponentOfferingV2(@RpcPayload() dto: ComponentOfferingRequestDto){
    return this.offeringV2Service.getDeviceComponentOffering(dto);
  }

  @MessagePattern(OfferingTopics.DEVICE_MAP_OFFERING)
  getDeviceMapOffering(@RpcPayload("stringValue") deviceId: string){  
    this.logger.debug(`get map offering for device: ${deviceId}`)  
    return this.offeringV2Service.getDeviceMapOffering(deviceId)
  }

  @EventPattern(OfferingTopicsEmit.OFFERING_PUSH)
  pushOffering(@RpcPayload() po: PushOfferingDto){
    this.logger.log(`Push offering of catalogId: ${po.catalogId}, type: ${po.itemType}`);
    if(po.itemType == ItemTypeEnum.SOFTWARE){
      this.offeringV2Service.pushSoftwareOffering(po);
    }else if (po.itemType == ItemTypeEnum.MAP){
      this.offeringV2Service.pushMapOffering(po);
    }
  }

  @EventPattern(OfferingTopicsEmit.COMPONENT_UPLOAD_EVENT)
  uploadEvent(@RpcPayload() event: UploadEventDto){
    this.logger.log(`Component Upload event ${event.catalogId}`);
    this.offeringService.uploadEvent(event);
  }

  @EventPattern(OfferingTopicsEmit.DEVICE_SOFTWARE_EVENT)
  deviceSoftwareEvent(@RpcPayload() event: DeviceSoftwareStateDto){
    this.logger.log(`Device software event`);
    this.offeringV2Service.deviceSoftwareEvent(event);
  }

  @EventPattern(OfferingTopicsEmit.DEVICE_MAP_EVENT)
  deviceMapEvent(@RpcPayload() event: DeviceMapStateDto){
    this.logger.log(`Device map event`);
    this.offeringV2Service.deviceMapEvent(event);
  }

  @MessagePattern(OfferingTopics.CHECK_HEALTH)
  healthCheckSuccess(){
    const version = this.readImageVersion()
    this.logger.log(`Offering service - Health checking, Version: ${version}`)
    return "Offering service is running successfully. Version: " + version
  }

  private readImageVersion(){
    let version = 'unknown'
    try{
      version = fs.readFileSync('NEW_TAG.txt','utf8');
    }catch(error){
      this.logger.error(`Unable to read image version - error: ${error}`)
    }
    return version
  }
}
