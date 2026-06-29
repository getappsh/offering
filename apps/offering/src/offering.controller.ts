import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OfferingTopics, OfferingTopicsEmit } from '@app/common/microservice-client/topics';
import { ComponentOfferingRequestDto, UpsertOfferingTreePolicyDto, OfferingTreePolicyParams, PushOfferingDto, BatchPushOfferingRequestDto } from '@app/common/dto/offering';
import { ItemTypeEnum } from '@app/common/database/entities';
import { ReleaseChangedEventDto } from '@app/common/dto/upload';
import { DeviceComponentStateDto } from '@app/common/dto/device/dto/device-software.dto';
import { DeviceMapStateDto } from '@app/common/dto/device';
import { RpcPayload } from '@app/common/microservice-client';
import * as fs from 'fs';
import { OfferingService } from './offering.service';
import { DeviceTypeOfferingFilterQuery, GetProjectsOfferingDto, OfferingParamsCombined, ProjectOfferingFilterQuery } from '@app/common/dto/offering/dto/offering.dto';
import { OfferingTreePolicyService } from './offering-tree-policy.service';

@Controller()
export class OfferingController {

  private readonly logger = new Logger(OfferingController.name);

  constructor(
    private readonly offeringService: OfferingService,
    private readonly policyService: OfferingTreePolicyService,
  ) { }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_PLATFORM)
  getOfferingForPlatform(@RpcPayload() params: OfferingParamsCombined) {
    return this.offeringService.getOfferingForPlatform(params);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_ALL_PLATFORMS)
  getAllPlatformsOffering(@RpcPayload() query: { withDependencies?: boolean; useHierarchyCache?: boolean }) {
    return this.offeringService.getAllPlatformsOffering(query);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_ALL_DEVICE_TYPES)
  getAllDeviceTypesOffering(@RpcPayload() query: { withDependencies?: boolean; useHierarchyCache?: boolean }) {
    return this.offeringService.getAllDeviceTypesOffering(query);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_DEVICE_TYPE)
  getOfferingForDeviceType(@RpcPayload() query: DeviceTypeOfferingFilterQuery) {
    return this.offeringService.getOfferingForDeviceType(query);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_PROJECT)
  getOfferingForProject(@RpcPayload() query: ProjectOfferingFilterQuery) {
    return this.offeringService.getOfferingForProject(query);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_FOR_ALL_PROJECTS)
  getOfferingForProjects(@RpcPayload() dto: GetProjectsOfferingDto) {
    return this.offeringService.getOfferingForProjects(dto);
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

  @MessagePattern(OfferingTopics.GET_PUSH_OFFERING_DEVICES)
  getPushOfferingDevices(@RpcPayload("stringValue") catalogId: string) {
    this.logger.debug(`get push offering devices for catalogId: ${catalogId}`);
    return this.offeringService.getPushOfferingDevices(catalogId);
  }

  @MessagePattern(OfferingTopics.GET_BATCH_PUSH_OFFERINGS_FOR_DEVICES)
  getBatchPushOfferingsForDevices(@RpcPayload() dto: BatchPushOfferingRequestDto) {
    return this.offeringService.getBatchPushOfferingsForDevices(dto);
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

  @EventPattern(OfferingTopicsEmit.OFFERING_UNPUSH)
  async unpushOffering(@RpcPayload() po: PushOfferingDto) {
    this.logger.log(`Unpush offering of catalogId: ${po.catalogId}, type: ${po.itemType}`);
    if (po.itemType == ItemTypeEnum.SOFTWARE) {
      await this.offeringService.unpushSoftwareOffering(po);
    } else if (po.itemType == ItemTypeEnum.MAP) {
      await this.offeringService.unpushMapOffering(po);
    }
  }

  @MessagePattern(OfferingTopics.CONFIG_OFFERING_PUSH)
  async pushConfigOffering(@RpcPayload() po: PushOfferingDto) {
    this.logger.log(`Push config offering for catalogId: ${po.catalogId}`);
    await this.offeringService.pushConfigOffering(po);
    return { success: true };
  }

  @MessagePattern(OfferingTopics.CONFIG_OFFERING_UNPUSH)
  async unpushConfigOffering(@RpcPayload() po: PushOfferingDto) {
    this.logger.log(`Unpush config offering for catalogId: ${po.catalogId}`);
    await this.offeringService.unpushConfigOffering(po);
    return { success: true };
  }

  @MessagePattern(OfferingTopics.GET_CONFIG_OFFERING_FOR_DEVICE)
  getConfigOfferingForDevice(@RpcPayload('stringValue') agentDeviceId: string) {
    this.logger.debug(`get config offering for agent device: ${agentDeviceId}`);
    return this.offeringService.getConfigOfferingForDevice(agentDeviceId);
  }

  @MessagePattern(OfferingTopics.GET_CONFIG_RELEASES_FOR_DEVICES)
  getConfigReleasesForDevices(@RpcPayload() deviceIds: string[]) {
    this.logger.debug(`get config releases for devices: ${deviceIds?.length}`);
    return this.offeringService.getConfigReleasesForDevices(deviceIds);
  }

  @EventPattern(OfferingTopicsEmit.RELEASE_CHANGED_EVENT)
  releaseChangedEvent(@RpcPayload() event: ReleaseChangedEventDto) {
    this.logger.log(`Release changed event for catalogId: ${event.catalogId}, event: ${event.event}`);
    this.offeringService.releaseChangedEvent(event);
    this.policyService.releaseChangedEvent(event);
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

  @MessagePattern(OfferingTopics.UPSERT_OFFERING_TREE_POLICY)
  upsertOfferingTreePolicy(@RpcPayload() dto: UpsertOfferingTreePolicyDto) {
    return this.policyService.upsert(dto);
  }

  @MessagePattern(OfferingTopics.GET_OFFERING_TREE_POLICIES)
  getOfferingTreePolicies(@RpcPayload() dto: OfferingTreePolicyParams) {
    // TODO 
    return this.policyService.findBy(dto);
  }


  private readImageVersion() {
    let version = 'unknown'
    try {
      version = fs.readFileSync('offering_image_version.txt', 'utf8');
    } catch (error) {
      this.logger.error(`Unable to read image version - error: ${error}`)
    }
    return version
  }
}
