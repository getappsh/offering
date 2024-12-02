import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import {  RpcException } from '@nestjs/microservices';
import { Raw, Repository, ILike } from 'typeorm';
import {
  ComponentOfferingEntity,
  DeviceComponentStateEnum,
  DeviceEntity,
  DeviceMapStateEnum,
  DiscoveryMessageEntity,
  DiscoveryType,
  MapEntity,
  MapOfferingEntity,
  OfferingActionEnum,
  UploadStatus,
  UploadVersionEntity,
} from '@app/common/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceComponentsOfferingDto, OfferingResponseDto, PushOfferingDto, OfferingMapPushResDto } from '@app/common/dto/offering';
import { DiscoveryMessageDto } from '@app/common/dto/discovery';
import { ComponentDto, PlatformDto } from '@app/common/dto/discovery';
import { MicroserviceName, MicroserviceClient } from '@app/common/microservice-client';
import { DeviceTopics, DeviceTopicsEmit } from '@app/common/microservice-client/topics';
import { lastValueFrom } from 'rxjs';
import { DeviceDto } from '@app/common/dto/device/dto/device.dto';
import { DeviceSoftwareStateDto } from '@app/common/dto/device/dto/device-software.dto';
import { DeviceMapStateDto } from '@app/common/dto/device';
import { MapDto } from '@app/common/dto/map';
import { UploadEventDto, UploadEventEnum } from '@app/common/dto/upload';
import { Cron } from '@nestjs/schedule';
import { SafeCron } from '@app/common/safe-cron';

@Injectable()
export class OfferingService implements OnModuleInit{
  private readonly logger = new Logger(OfferingService.name);

  constructor(
    @InjectRepository(UploadVersionEntity)private readonly uploadVersionRepo: Repository<UploadVersionEntity>,
    @InjectRepository(ComponentOfferingEntity)private readonly compOfferingRepo: Repository<ComponentOfferingEntity>,
    @InjectRepository(MapOfferingEntity)private readonly mapOfferingRepo: Repository<MapOfferingEntity>,
    @InjectRepository(DeviceEntity) private readonly deviceRepo: Repository<DeviceEntity>,
    @Inject(MicroserviceName.DISCOVERY_SERVICE) private readonly deviceClient: MicroserviceClient,
  
  ) {}

  async getOfferOfComp(catalogId: string): Promise<ComponentDto>{
    const comp = await this.uploadVersionRepo.findOneBy({catalogId: catalogId});
    if (!comp) {
      this.logger.warn(`Component not found, catalogId ${catalogId}`);
      // todo check way the exception message is not returned
      throw new NotFoundException('Component not found');

    }
    const compRes = ComponentDto.fromUploadVersionEntity(comp);
    return compRes
  }
  
  async checkUpdates(dis: DiscoveryMessageDto): Promise<OfferingResponseDto> {
    const deviceId = dis.general.physicalDevice.ID;
    this.logger.debug(`Create offering for device "${deviceId}"`);
    const offeringRes = new OfferingResponseDto()
    offeringRes.isNewVersion = false;

    const platformName = dis?.softwareData?.platform.name || "Merkava";
    const formation = dis?.softwareData?.formation || "yatush";
    const OS = dis.general.physicalDevice.OS
    if (!platformName || !formation){
      return offeringRes
    }


    this.logger.debug(`Platform: ${platformName}, Formation: ${formation}`)
    let offered_components  = await this.uploadVersionRepo.find({
      where: {
        platform: ILike(platformName),
        formation: ILike(formation),
        OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) ILIKE :value', {value: OS}),
        uploadStatus: UploadStatus.READY
      }
    });

    for (let comp of offered_components){
      if (!offeringRes.isNewVersion){
        offeringRes.isNewVersion = true;
        offeringRes.platform = new PlatformDto();
        offeringRes.platform.name = platformName;
        offeringRes.platform.components = [];
      }

      const compRes = ComponentDto.fromUploadVersionEntity(comp);

      offeringRes.platform.components.push(compRes)
    }
    this.logger.debug(`Offering for device: "${deviceId}" offering comps: [${offeringRes?.platform?.components.map(comp => comp.catalogId)}]`)
    return offeringRes;

  }

  @SafeCron({cronTime: process.env.COMPONENT_OFFERING_JOB_TIME ?? "0 0 * * * *", name: "device-component-offering"})
  async offeringComponentTask(){
    this.logger.log(`Start offering component task`);
    for (let i = 0;; i++){
      let result = await this.devicesWithPlatformAndFormation(i);
      if (!result) return;

      const platform = result.platform|| "Merkava";
      const formation = result.formation || "yatush";
  
      this.logger.debug(`Search offering for platform: ${platform}, formation: ${formation}, OS: ${result.os}, number of associated devices: ${result.devices.length}`)
      
      let offeredComponents  = await this.uploadVersionRepo.find({
        where: {
          platform: ILike(platform),
          formation: ILike(formation),
          OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) ILIKE :value', {value: result.os}),
          uploadStatus: UploadStatus.READY
        }
      });

      this.logger.debug(`${offeredComponents.length} offered components have been found`)
      for (let comp of offeredComponents){
        await this.setSoftwareOffering(result.devices, comp.catalogId, OfferingActionEnum.OFFERING);
        this.sendDeviceSoftwareState(result.devices, comp.catalogId, DeviceComponentStateEnum.OFFERING);
      }
    }
  }

  private async devicesWithPlatformAndFormation(offset: number): Promise<{devices: [string], platform: string, formation: string, os: string}>{
    return this.deviceRepo.manager.connection.createQueryBuilder()
    .select([
        "array_agg(DISTINCT sub.deviceID) AS devices",
        "lower(sub.platform) as platform",
        "lower(sub.formation) as formation",
        "sub.OS"
    ])
    .addFrom(
      (dp) => {
        return dp.select([
          "d.ID as deviceID",
          "dm.discovery_data -> 'platform' ->> 'name' AS platform",
          "dm.discovery_data ->> 'formation' AS formation",
          "d.OS AS OS"
        ])
        .from(DeviceEntity, "d")
        .leftJoin(DiscoveryMessageEntity, "dm", "d.ID = dm.deviceID and dm.discoveryType != :dtype", {dtype: DiscoveryType.MTLS})
        .orderBy("d.ID")
        .addOrderBy("dm.lastUpdatedDate", "DESC")
        .distinctOn(["d.ID"])
      },
      "sub"
    )
    .groupBy("lower(sub.platform)")
    .addGroupBy("lower(sub.formation)")
    .addGroupBy("sub.OS")
    .offset(offset)
    .limit(1)
    .getRawOne()
  }

  async getDeviceComponentOffering(deviceId: string): Promise<DeviceComponentsOfferingDto>{
    this.logger.log("get device component offering");
    let comps = await this.compOfferingRepo.find({where: {device: {ID: deviceId}}, relations: {component: true}})

    let deviceOffering = new DeviceComponentsOfferingDto()

    deviceOffering.offer = comps.filter(dc => dc.action == OfferingActionEnum.OFFERING).map(dc => ComponentDto.fromUploadVersionEntity(dc.component));
    deviceOffering.push = comps.filter(dc => dc.action == OfferingActionEnum.PUSH).map(dc => ComponentDto.fromUploadVersionEntity(dc.component));

    return deviceOffering
  }

  async getDeviceMapOffering(deviceId: string){
    this.logger.log("get device map offering");
    let maps = await this.mapOfferingRepo.find({where: {device: {ID: deviceId}}, relations: {map: {mapProduct: true}}});
    
    let deviceOffering = new OfferingMapPushResDto()
    deviceOffering.push = maps.filter(dm => dm.action == OfferingActionEnum.PUSH).map(dm => MapDto.fromMapEntity(dm.map));

    return deviceOffering
  }

  private async getDevicesInGroup(groups: number[]): Promise<string[]>{
    this.logger.debug(`get devices in groups: ${JSON.stringify(groups)}`);
    let devices: DeviceDto[] = await lastValueFrom(this.deviceClient.send(DeviceTopics.All_DEVICES, {groups: groups}));
    let ids = devices.map(d => d.id)
    return ids;
  }


  async setSoftwareOffering(devices: string[], catalogId: string, action: OfferingActionEnum){
    this.logger.log(`Update software offering - software: ${catalogId}, action: ${action}, number of devices: ${devices.length}`);
    
    let compsOffering = [];
    for (let id of devices){
      let entity = this.compOfferingRepo.create();
      entity.action = action;
      entity.component = {catalogId: catalogId} as UploadVersionEntity;
      entity.device = {ID: id} as DeviceEntity;
      compsOffering.push(entity);
    }
      
    try {
      if (action === OfferingActionEnum.PUSH){
        await this.compOfferingRepo.upsert(compsOffering, ['device', 'component']);
      }else if(action === OfferingActionEnum.OFFERING){
        await this.compOfferingRepo.createQueryBuilder()
        .insert()
        .values(compsOffering)
        .orIgnore()
        .execute();
      }
    }catch(err){
      this.logger.error(`error update comp offering, ${err}`);
      return
    }   
  }

  async sendDeviceSoftwareState(devices: string[], catalogId: string, state: DeviceComponentStateEnum){
    this.logger.log(`Send software state - software: ${catalogId}, state: ${state}, number of devices: ${devices.length}`);

    let devicesState = []
    for (let id of devices){
      let deviceState = new DeviceSoftwareStateDto();
      deviceState.state = state;
      deviceState.catalogId = catalogId;
      deviceState.deviceId = id;
      devicesState.push(deviceState);
    }

    const batchSize = 15;
    for (let i = 0; i < devicesState.length; i += batchSize) {
      const batch = devicesState.slice(i, i + batchSize);
      this.logger.debug(`Send device software state from index ${i} to ${i + batchSize - 1}:`);
      this.deviceClient.emit(DeviceTopicsEmit.UPDATE_DEVICE_SOFTWARE_STATE, batch);
    }
  }

  async pushSoftwareOffering(po: PushOfferingDto){
    this.logger.debug(`push software offering`);
    let devices = po.devices;
    if (po.groups.length > 0){
      let idsInGroup = await this.getDevicesInGroup(po.groups);
      devices.push(...idsInGroup);
    }
    await this.setSoftwareOffering(devices, po.catalogId, OfferingActionEnum.PUSH)
    this.sendDeviceSoftwareState(devices, po.catalogId, DeviceComponentStateEnum.PUSH)
  }
  async uploadEvent(uploadEvent: UploadEventDto){
    if (uploadEvent.event === UploadEventEnum.ERROR){
      this.logger.log("upload event: error")
      this.logger.debug(`delete comp: ${uploadEvent.catalogId} offering form devices`);
      this.compOfferingRepo.delete({component: {catalogId: uploadEvent.catalogId}});

      this.deviceClient.emit(DeviceTopicsEmit.COMPONENT_EVENT, uploadEvent);
      
    }else if (uploadEvent.event === UploadEventEnum.READY){
      this.logger.log("upload event: ready")
      this.logger.debug("get device that updatable by the component")
      let devices = await this.deviceRepo.manager.connection.createQueryBuilder()
        .select("sub.deviceID as id")
        .addFrom(
          (dp) => {
            return dp.select([
              "d.ID as deviceID",
              "dm.discovery_data -> 'platform' ->> 'name' AS platform",
              "dm.discovery_data ->> 'formation' AS formation",
              "d.OS AS OS"
            ])
            .from(DeviceEntity, "d")
            .leftJoin(DiscoveryMessageEntity, "dm", "d.ID = dm.deviceID and dm.discoveryType != :dtype", {dtype: DiscoveryType.MTLS})
            .orderBy("d.ID")
            .addOrderBy("dm.lastUpdatedDate", "DESC")
            .distinctOn(["d.ID"])
          },
          "sub"
        )
        .where(`sub.OS ILIKE COALESCE(:OS, sub.OS)`, {OS: uploadEvent.OS})
        .andWhere(`COALESCE(NULLIF(sub.platform, ''), 'merkava') ILIKE :platformName`, { platformName: uploadEvent.platform })
        .andWhere(`COALESCE(NULLIF(sub.formation, ''), 'yatush') ILIKE :formation`, { formation: uploadEvent.formation })
        .distinctOn(["sub.deviceID"])
        .getRawMany();

      const ids = devices.map(device => device.id);
      await this.setSoftwareOffering(ids, uploadEvent.catalogId, OfferingActionEnum.OFFERING);
      this.sendDeviceSoftwareState(ids, uploadEvent.catalogId, DeviceComponentStateEnum.OFFERING)
    }
  }

  async deviceSoftwareEvent(event: DeviceSoftwareStateDto){
    this.logger.debug(`device: ${event.deviceId}, component: ${event.catalogId}, event: ${event.state}`);
    if (event.state === DeviceComponentStateEnum.INSTALLED){
      this.logger.debug(`delete comp: ${event.catalogId} offering form device: ${event.deviceId}`);
      this.compOfferingRepo.delete({component: {catalogId: event.catalogId}, device: {ID: event.deviceId}});
    }
  }

  async deviceMapEvent(event: DeviceMapStateDto){
    this.logger.debug(`device: ${event.deviceId}, map: ${event.catalogId}, event: ${event.state}`);
    if (event.state === DeviceMapStateEnum.INSTALLED){
      this.logger.debug(`delete map: ${event.catalogId} offering form device: ${event.deviceId}`);
      this.mapOfferingRepo.delete({map: {catalogId: event.catalogId}, device: {ID: event.deviceId}});
    }

  }
  async pushMapOffering(po: PushOfferingDto){
    this.logger.debug(`push map offering`);
    let devices = po.devices;
    if (po.groups.length > 0){
      let idsInGroup = await this.getDevicesInGroup(po.groups);
      devices.push(...idsInGroup);
    }

    let mapsOffering = []
    let devicesState = []

    for (let id of devices){
      let entity = this.mapOfferingRepo.create();
      entity.action = OfferingActionEnum.PUSH;
      entity.map = {catalogId: po.catalogId} as MapEntity;
      entity.device = {ID: id} as DeviceEntity;
      mapsOffering.push(entity);

      let deviceState = new DeviceMapStateDto();
      deviceState.state = DeviceMapStateEnum.PUSH;
      deviceState.catalogId = po.catalogId;
      deviceState.deviceId = id;
      devicesState.push(deviceState);
    }
    try {
      await this.mapOfferingRepo.upsert(mapsOffering, ['device', 'map']);
    }catch(err){
      this.logger.error(`error update map offering, ${err}`);
      return
    } 

    this.logger.log("Send device map state");
    this.deviceClient.emit(DeviceTopicsEmit.UPDATE_DEVICE_MAP_STATE, devicesState);
  }

  // private getNewVersion(platform: string, OS: string, formation: string, component: string, currentVersion: string) {
  //   return this.uploadVersionRepo.findOne({
  //     where: {
  //       platform: platform,
  //       formation: formation,
  //       component: component,
  //       OS: Raw(() => 'COALESCE(UploadVersionEntity.OS, :value) = :value', {value: OS}),
  //       version: MoreThan(currentVersion),
  //     },
  //     order: {
  //       version: 'DESC',
  //     },
  //   });
  // }
  // async checkUpdates(dis: DiscoveryMessageDto) {
  //   this.logger.debug('Create offering');
  //   const offeringRes = new OfferingResponseDto()
  //   offeringRes.isNewVersion = false;

  //   const platformName = dis.data.platform.name;
  //   const formation = dis.data.formation;
  //   const OS = dis.general.physicalDevice.OS


  //   this.logger.debug(`Platform: ${platformName}, Formation: ${formation}`)
  //   for (let comp of dis.data.platform.components){
  //     const newVersion = await this.getNewVersion(platformName, OS, formation, comp.name, comp.versionNumber)

  //     if (!newVersion){
  //       this.logger.debug(`No new Version has been found to component: ${comp.name}, version: ${comp.versionNumber}`)
  //       continue;
  //     }
  //     if (!offeringRes.isNewVersion){
  //       offeringRes.isNewVersion = true;
  //       offeringRes.platform = new PlatformDto();
  //       offeringRes.platform.name = platformName;
  //       offeringRes.platform.components = [];
  //     }
  //     this.logger.debug(`New Version has been found to component: ${newVersion.component}, version: ${newVersion.version}`)
  //     const compRes = new ComponentDto()
  //     compRes.id = newVersion.id.toString();
  //     compRes.name = newVersion.component;
  //     compRes.versionNumber = newVersion.version;
  //     compRes.baseVersion = newVersion.baseVersion || "";
  //     compRes.prevVersion = newVersion.prevVersion || "";
  //     compRes.catalogId = newVersion.catalogId;
      
  //     compRes.virtualSize = newVersion.virtualSize;
      
  //     compRes.category = newVersion.metadata?.category;
  //     compRes.releaseNotes = newVersion.metadata?.releaseNote;

  //     compRes.urlPath = await this.s3Service.generatePresignedUrlForDownload(newVersion.s3Url);

  //     offeringRes.platform.components.push(compRes)
  //   }

  //   return offeringRes;
  // }



  // private getPackageStatus(OS: string, formation: string, currentVersion: string, latestVersion: string) {
  //   return this.versionPackageRepo.findOne({
  //     where: {
  //       OS: OS,
  //       formation: formation,
  //       fromVersion: currentVersion,
  //       toVersion: latestVersion,
  //       },
  //     });
  //   }
  
    
  //   private async sendToDelivery(OS: OS, formation: string, currentVersion: string, latestVersion: string){
  //     const packageStatus = await this.getPackageStatus(OS, formation, currentVersion, latestVersion);
  //     if (packageStatus){
  //       this.logger.debug("Offering Already on delivery");
  //     }else {
  //       const pm = new PackageMessageDto(OS, formation, currentVersion, latestVersion);
  //       await validateOrReject(pm)
  
  //       this.logger.debug(`Send to delivery a new packages to be prepare: ${pm}`);
  //       this.offeringMicroClient.emit(
  //         DeliveryTopics.PREPARE_PACKAGE,
  //         pm,
  //       );
  //     }
  //   }

  // // get all component and sub components recursively, if components appear twice takeing the lower version.
  // private getAllComponentVersions(versions: {string: string}, components: ComponentDto[]){
  //   if (!Array.isArray(components)){
  //     return
  //   }
  //   for (const comp of components) {
  //     if(comp.name in versions){
  //       versions[comp.name] = (versions[comp.name] < comp.versionNumber) ? versions[comp.name] : comp.versionNumber;
  //     }else {
  //       versions[comp.name] = comp.versionNumber;
  //     }
  //     this.getAllComponentVersions(versions, comp.subComponents);
  //   }
  // }
  
  // async checkUpdates(dism: DiscoveryMessageDto) {
  //   this.logger.debug('Create offering');
    
  //   const versions = {} as {string: string};
  //   const offeringRes: OfferingResponseDto[]  = [];
  //   const packageMessages: PackageMessageDto[] = [];

  //   const os = dism.general.physicalDevice.OS;

  //   versions[dism.data.baseVersion.name] = dism.data.baseVersion.versionNumber
  
  //   this.getAllComponentVersions(versions, dism.data.baseVersion.components)

  //   this.logger.debug(`Found ${Object.keys(versions).length} components: ${Object.keys(versions)}`)

  //   for (const key in versions){
  //     const newVer = await this.getNewVersion(key, os, versions[key]);

  //     if (newVer == null){
  //       continue
  //     }

  //     let status: string;
  //     let latestVersion = newVer.baseVersion;

  //     const packageStatus = await this.getPackageStatus(os, key, versions[key], latestVersion);

  //     if (packageStatus == null) {
  //       const pm = new PackageMessageDto(os, key, versions[key], latestVersion)
  //       await validateOrReject(pm)
  //       packageMessages.push(pm);

  //       status = 'startingProgress';
  //     } else {
  //       status = packageStatus.status;
  //     }
  //     offeringRes.push(new OfferingResponseDto(os, key, versions[key], latestVersion, status))
  //   }

  //   this.logger.debug(`Send to delivery ${packageMessages.length} new packages to be prepare`);
  //   if (packageMessages.length) {
  //     this.offeringMicroClient.emit(
  //       DeliveryTopics.PREPARE_PACKAGE,
  //       packageMessages,
  //     );
  //   }

  //   this.logger.debug(`Found ${offeringRes.length} packages to offer: ${offeringRes}`);

  //   return offeringRes;
  // }


  async onModuleInit() {
    this.deviceClient.subscribeToResponseOf([DeviceTopics.All_DEVICES])
    await this.deviceClient.connect()

  }

}
