import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OfferingTopics, OfferingTopicsEmit } from '@app/common/microservice-client/topics';
import { ComponentOfferingRequestDto, PushOfferingDto } from '@app/common/dto/offering';
import { ItemTypeEnum } from '@app/common/database/entities';
import { ReleaseChangedEventDto } from '@app/common/dto/upload';
import { DeviceComponentStateDto } from '@app/common/dto/device/dto/device-software.dto';
import { DeviceMapStateDto } from '@app/common/dto/device';
import { RpcPayload } from '@app/common/microservice-client';
import * as fs from 'fs';
import { OfferingService } from './offering.service';
import { ProjectIdentifierParams } from '@app/common/dto/project-management';
import { DeviceTypeOfferingParams, PlatformOfferingParams } from '@app/common/dto/offering/dto/offering.dto';

@Controller()
export class OfferingController {

  private readonly logger = new Logger(OfferingController.name);

  constructor(
    private readonly offeringService: OfferingService
  ) { }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_PLATFORM)
  getOfferingForPlatform(@RpcPayload() params: PlatformOfferingParams) {
    return this.offeringService.getOfferingForPlatform(params);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_DEVICE_TYPE)
  getOfferingForDeviceType(@RpcPayload() params: DeviceTypeOfferingParams) {
    return this.offeringService.getOfferingForDeviceType(params);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_PROJECT)
  getOfferingForProject(@RpcPayload() params: ProjectIdentifierParams) {
    return this.offeringService.getOfferingForProject(params);
  }

  @MessagePattern(OfferingTopics.DEVICE_COMPONENT_OFFERING)
  getDeviceComponentOffering(@RpcPayload() dto: ComponentOfferingRequestDto) {
    return this.offeringService.getDeviceComponentOffering(dto);
  }

  @MessagePattern(OfferingTopics.GET_OFFER_OF_COMP)
  getOfferOfComp(@RpcPayload("stringValue") catalogId: string) {
    this.logger.debug(`get offering for comp: ${catalogId}`)
    return this.offeringService.getOfferOfComp(catalogId)
  }


  @MessagePattern(OfferingTopics.DEVICE_MAP_OFFERING)
  getDeviceMapOffering(@RpcPayload("stringValue") deviceId: string) {
    this.logger.debug(`get map offering for device: ${deviceId}`)
    return this.offeringService.getDeviceMapOffering(deviceId)
  }

  @EventPattern(OfferingTopicsEmit.OFFERING_PUSH)
  pushOffering(@RpcPayload() po: PushOfferingDto) {
    this.logger.log(`Push offering of catalogId: ${po.catalogId}, type: ${po.itemType}`);
    if (po.itemType == ItemTypeEnum.SOFTWARE) {
      this.offeringService.pushSoftwareOffering(po);
    } else if (po.itemType == ItemTypeEnum.MAP) {
      this.offeringService.pushMapOffering(po);
    }
  }

  @EventPattern(OfferingTopicsEmit.RELEASE_CHANGED_EVENT)
  releaseChangedEvent(@RpcPayload() event: ReleaseChangedEventDto) {
    this.logger.log(`Release changed event for catalogId: ${event.catalogId}, event: ${event.event}`);
    this.offeringService.releaseChangedEvent(event);
  }

  @EventPattern(OfferingTopicsEmit.DEVICE_SOFTWARE_EVENT)
  deviceSoftwareEvent(@RpcPayload() event: DeviceComponentStateDto) {
    this.logger.log(`Device software event`);
    this.offeringService.deviceSoftwareEvent(event);
  }

  @EventPattern(OfferingTopicsEmit.DEVICE_MAP_EVENT)
  deviceMapEvent(@RpcPayload() event: DeviceMapStateDto) {
    this.logger.log(`Device map event`);
    this.offeringService.deviceMapEvent(event);
  }

  @MessagePattern(OfferingTopics.CHECK_HEALTH)
  healthCheckSuccess() {
    const version = this.readImageVersion()
    this.logger.log(`Offering service - Health checking, Version: ${version}`)
    return "Offering service is running successfully. Version: " + version
  }

  private readImageVersion() {
    let version = 'unknown'
    try {
      version = fs.readFileSync('NEW_TAG.txt', 'utf8');
    } catch (error) {
      this.logger.error(`Unable to read image version - error: ${error}`)
    }
    return version
  }
}
