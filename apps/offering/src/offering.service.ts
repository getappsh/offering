import { ComponentOfferingEntity, DeviceComponentStateEnum, DeviceEntity, DeviceMapStateEnum, MapEntity, MapOfferingEntity, OfferingActionEnum, ProjectEntity, ProjectType, ReleaseEntity, ReleaseStatusEnum } from "@app/common/database/entities";
import { DeviceMapStateDto } from "@app/common/dto/device";
import { DeviceComponentStateDto } from "@app/common/dto/device/dto/device-software.dto";
import { DeviceDto } from "@app/common/dto/device/dto/device.dto";
import { MapDto } from "@app/common/dto/map";
import { DeviceComponentsOfferingDto, ComponentOfferingRequestDto, PushOfferingDto, OfferingMapPushResDto } from "@app/common/dto/offering";
import { ComponentV2Dto, ReleaseChangedEventDto, ReleaseDto } from "@app/common/dto/upload";
import { MicroserviceClient, MicroserviceName } from "@app/common/microservice-client";
import { DeviceTopics, DeviceTopicsEmit } from "@app/common/microservice-client/topics";
import { SafeCron } from "@app/common/safe-cron";
import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { lastValueFrom } from "rxjs";
import { ArrayOverlap, In, Repository } from "typeorm";


@Injectable()
export class OfferingService implements OnModuleInit {
  private readonly logger = new Logger(OfferingService.name);

  constructor(
    @InjectRepository(ReleaseEntity)private readonly releaseRepo: Repository<ReleaseEntity>,
    @InjectRepository(ProjectEntity)private readonly projectRepo: Repository<ProjectEntity>, 
    @InjectRepository(DeviceEntity)private readonly deviceRepo: Repository<DeviceEntity>, 
    @InjectRepository(ComponentOfferingEntity)private readonly compOfferingRepo: Repository<ComponentOfferingEntity>,
    @InjectRepository(MapOfferingEntity)private readonly mapOfferingRepo: Repository<MapOfferingEntity>,
    
    @Inject(MicroserviceName.DISCOVERY_SERVICE) private readonly deviceClient: MicroserviceClient,
    
  ){}

  async getDeviceComponentOffering(dto: ComponentOfferingRequestDto): Promise<DeviceComponentsOfferingDto>{
    this.logger.log(`Get offering for device: ${dto.deviceId}`);

    // const [updates, offering] = await Promise.all([
    //   this.getUpdatesForComponents(dto),
    //   this.getOfferingFromFormationsAndComponents(dto)
    // ])
    // const uniqueOffering = offering.filter(o => !updates.some(u => u.catalogId == o.catalogId))
    // const res = [...uniqueOffering, ...updates].filter(r => !dto.products.includes(r.catalogId));

    const [offering, push] = await Promise.all([
      this.getOfferingFromFormationsPlatformsAndComponents(dto),
      this.compOfferingRepo.find({
        select: {release: {
          version: true, catalogId: true, releaseNotes: true, status: true, createdAt: true, updatedAt: true,
          project: {id: true, name: true, projectType: true}, artifacts: {fileUpload: {size: true}, isInstallationFile: true},
        }},
        where: {device: {ID: dto.deviceId}, action: OfferingActionEnum.PUSH}, 
        relations: {release: {project: true, artifacts: {fileUpload: true}}}})
    ])

    const res = new DeviceComponentsOfferingDto()
    res.offer = offering
      ?.filter(o => !dto.components?.includes(o.catalogId) && !push?.some(p => p?.release?.catalogId == o.catalogId))
      ?.map(o => ComponentV2Dto.fromEntity(o)); 

    res.push = push
      ?.filter(p => !dto.components?.includes(p.release.catalogId))
      ?.map(p => ComponentV2Dto.fromEntity(p.release)); 

    this.logger.log(`Get offering for device: ${dto.deviceId}, offer count: ${res.offer?.length}, push count: ${res.push?.length}`);

    this.setDeviceSoftwaresOffering(dto.deviceId, res.offer.map(o => o.id), OfferingActionEnum.OFFERING)
    this.sendDeviceSoftwaresState(dto.deviceId, res.offer.map(o => o.id), DeviceComponentStateEnum.OFFERING);
    return res
  }

  private async getOfferingFromFormationsPlatformsAndComponents(dto: ComponentOfferingRequestDto): Promise<ReleaseEntity[]>{
    const projects = await this.projectRepo.find({
      select: {id: true, platforms: false},
      where: [
        {
          releases: {catalogId: In(dto.components ?? [])}
        },
        {
          projectType: ProjectType.FORMATION,
          name: In(dto.formations ?? []),
        },
        {
          projectType: ProjectType.PRODUCT,
          platforms: {name: In(dto.platforms ?? [])},
        }
      ]
    });
    const projectIds = projects.map(p => p.id);
    this.logger.log(`Get offering for device: ${dto.deviceId}, associated projects: ${projectIds}`);

    const offering = await this.releaseRepo.find({
      select: {project: {id: true, name: true, projectType: true}, artifacts: {fileUpload: {size: true}, isInstallationFile: true}},
      where: {
          status: ReleaseStatusEnum.RELEASED,
          project: {id: In(projectIds)}
        },
      relations: {project: true, artifacts: {fileUpload: true}},
     });

     return offering
  }

  async getOfferOfComp(catalogId: string){
    const release = await this.releaseRepo.findOne({
      where: {
        catalogId: catalogId,
        status: ReleaseStatusEnum.RELEASED
      },
      relations: {project: true, artifacts: {fileUpload: true}},
      select: { project: { id: true, name: true, projectType: true }, artifacts: { fileUpload: { size: true }, isInstallationFile: true} }
    })

    if (!release){
      throw new NotFoundException(`Release ${catalogId} not found`)
    }
    return ComponentV2Dto.fromEntity(release);
  }

  // Return the latest release for each component id
  async getUpdatesForComponents(components: string[]): Promise<ReleaseEntity[]> {
    this.logger.debug(`Get updates for releaseIds: ${components}`);
    const updates = await this.releaseRepo
      .createQueryBuilder("r")
      .innerJoin(
        qb =>
          qb
            .select("re.project_id", "project_id")
            .addSelect("MAX(re.sort_order)", "max_sort_order")
            .from(ReleaseEntity, "re")
            .where(sqb => {
              const subQuery = sqb
                .subQuery()
                .select("DISTINCT r.project_id")
                .from(ReleaseEntity, "r")
                .where("r.catalog_id IN (:...releaseIds)", { releaseIds: components })
                .getQuery();
              return `re.project_id IN (${subQuery})`;
            })
            .andWhere("re.status = :status", { status: ReleaseStatusEnum.RELEASED })
            .groupBy("re.project_id"),
        "latest",
        "r.project_id = latest.project_id AND r.sort_order = latest.max_sort_order"
      )
      .getMany()

      return updates.filter(r => !components.includes(r.catalogId))
  }


  private async getDevicesInGroup(groups: number[]): Promise<string[]>{
    this.logger.debug(`get devices in groups: ${JSON.stringify(groups)}`);
    let devices: DeviceDto[] = await lastValueFrom(this.deviceClient.send(DeviceTopics.All_DEVICES, {groups: groups}));
    let ids = devices.map(d => d.id)
    return ids;
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

  private async setDeviceSoftwaresOffering(deviceId: string, catalogIds: string[], action: OfferingActionEnum){
    this.logger.debug(`Set device software offering deviceId: ${deviceId}, catalogIds: ${catalogIds}, action: ${action}`);
    const entities = []

    for(const ci of catalogIds){
      const entity = this.compOfferingRepo.create()
      entity.action = action;
      entity.release = {catalogId: ci} as ReleaseEntity;
      entity.device = {ID: deviceId} as DeviceEntity;
      entities.push(entity)
    }

    await this.compOfferingRepo.manager.transaction(async entityManager => {
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(ComponentOfferingEntity)
        .where("device_ID = :deviceId", {deviceId})
        .andWhere("action = :action", {action})
        .execute()

      if (action === OfferingActionEnum.PUSH){
        await entityManager.upsert(ComponentOfferingEntity, entities,  ['device', 'release'])
      }else{
        await entityManager
          .createQueryBuilder()
          .insert()
          .into(ComponentOfferingEntity)
          .values(entities)
          .orIgnore()
          .execute()
      }
    })
    .catch(err => this.logger.error(`Failed to set device software offering: ${err}`));
 
  }

  private async sendDeviceSoftwaresState(deviceId: string, catalogIds: string[], state: DeviceComponentStateEnum){
    this.logger.debug(`Send device software state deviceId: ${deviceId}, catalogIds: ${catalogIds}, state: ${state}`);
    let devicesState = []

    for(const catalogId of catalogIds){
      let deviceState = new DeviceComponentStateDto();
      deviceState.state = state;
      deviceState.catalogId = catalogId;
      deviceState.deviceId = deviceId;
      devicesState.push(deviceState);
    }

    const batchSize = 15;
    for (let i = 0; i < devicesState.length; i += batchSize) {
      const batch = devicesState.slice(i, i + batchSize);
      this.logger.debug(`Send device software state from index ${i} to ${i + batchSize - 1}:`);
      this.deviceClient.emit(DeviceTopicsEmit.UPDATE_DEVICE_SOFTWARE_STATE, batch);
    }

  }

  async setSoftwareOffering(devices: string[], catalogId: string, action: OfferingActionEnum){
    this.logger.log(`Update software offering - software: ${catalogId}, action: ${action}, number of devices: ${devices.length}`);
    
    let compsOffering = [];
    for (let id of devices){
      let entity = this.compOfferingRepo.create();
      entity.action = action;
      entity.release = {catalogId: catalogId} as ReleaseEntity;
      entity.device = {ID: id} as DeviceEntity;
      compsOffering.push(entity);
    }
      
    try {
      if (action === OfferingActionEnum.PUSH){
        await this.compOfferingRepo.upsert(compsOffering, ['device', 'release']);
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
      let deviceState = new DeviceComponentStateDto();
      deviceState.state = state;
      deviceState.catalogId = catalogId;
      deviceState.deviceId = id;
      devicesState.push(deviceState);
    }

    const batchSize = 15;
    for (let i = 0; i < devicesState.length; i += batchSize) {
      const batch = devicesState.slice(i, i + batchSize);
      this.logger.debug(`Send devices software state from index ${i} to ${i + batchSize - 1}:`);
      this.deviceClient.emit(DeviceTopicsEmit.UPDATE_DEVICE_SOFTWARE_STATE, batch);
    }
  }


  async getDeviceMapOffering(deviceId: string){
    this.logger.log("get device map offering");
    let maps = await this.mapOfferingRepo.find({where: {device: {ID: deviceId}}, relations: {map: {mapProduct: true}}});
    
    let deviceOffering = new OfferingMapPushResDto()
    deviceOffering.push = maps.filter(dm => dm.action == OfferingActionEnum.PUSH).map(dm => MapDto.fromMapEntity(dm.map));

    return deviceOffering
  }


  async deviceSoftwareEvent(event: DeviceComponentStateDto){
    this.logger.debug(`device: ${event.deviceId}, component: ${event.catalogId}, event: ${event.state}`);
    if (event.state === DeviceComponentStateEnum.INSTALLED){
      this.logger.debug(`delete comp: ${event.catalogId} offering form device: ${event.deviceId}`);
      this.compOfferingRepo.delete({release: {catalogId: event.catalogId}, device: {ID: event.deviceId}});
    }
  }

  async deviceMapEvent(event: DeviceMapStateDto){
    this.logger.debug(`device: ${event.deviceId}, map: ${event.catalogId}, event: ${event.state}`);
    if (event.state === DeviceMapStateEnum.INSTALLED){
      this.logger.debug(`delete map: ${event.catalogId} offering form device: ${event.deviceId}`);
      this.mapOfferingRepo.delete({map: {catalogId: event.catalogId}, device: {ID: event.deviceId}});
    }
  }


  // // TODO pagination
  private getDevicesByPlatformsFormationsAndComponents(platforms: string[], formations: string[], projects: number[]): Promise<DeviceEntity[]>{
    return this.deviceRepo.find({
      select: {ID: true},
      where: [
        {components: {release: {project: {id: In(projects)}}}},
        {platform: {name: In(platforms)}},
        {formations: ArrayOverlap(formations)}
      ]
    })
  }

  async releaseChangedEvent(dto: ReleaseChangedEventDto){
    if (dto.event === ReleaseStatusEnum.RELEASED){
      const project = await this.projectRepo.findOneBy({releases: {catalogId: dto.catalogId}});

      const platforms = project.platforms?.map(p => p.name);
      const formation = project.projectType == ProjectType.FORMATION ? project.name : null;

      const device = await this.getDevicesByPlatformsFormationsAndComponents(platforms, [formation], [project.id])
      
      const ids = device.map(d => d.ID);
      this.logger.debug(`set comp: ${dto.catalogId} offering on devices: ${ids}`);

      await this.setSoftwareOffering(ids, dto.catalogId, OfferingActionEnum.OFFERING);
      this.sendDeviceSoftwareState(ids, dto.catalogId, DeviceComponentStateEnum.OFFERING)

    }else {
      this.logger.debug(`delete comp: ${dto.catalogId} offering form devices`);
      this.compOfferingRepo.delete({release: {catalogId: dto.catalogId}});

      this.deviceClient.emit(DeviceTopicsEmit.RELEASE_CHANGED_EVENT, dto);
    }
  }


  @SafeCron({cronTime: process.env.COMPONENT_OFFERING_JOB_TIME ?? "0 0 * * * *", name: "device-component-offering"})
  async offeringComponentTask(){
    this.logger.log(`Start offering component task`);
    const projects = await this.projectRepo.find({
      select: {releases: {catalogId: true}, platforms: {name: true}},
      where: {releases: {status: ReleaseStatusEnum.RELEASED}},
      relations: {releases: true}
    })
    
    for (const project of projects){
      const platforms = project.platforms?.map(p => p.name);
      const formation = project.projectType == ProjectType.FORMATION ? project.name : null;
      const devices = await this.getDevicesByPlatformsFormationsAndComponents(platforms, [formation], [project.id]);

      const ids = devices.map(d => d.ID);
      for (const release of project.releases){
        this.logger.debug(`set comp: ${release.catalogId} offering on devices: ${ids}`);
        await this.setSoftwareOffering(ids, release.catalogId, OfferingActionEnum.OFFERING);
        this.sendDeviceSoftwareState(ids, release.catalogId, DeviceComponentStateEnum.OFFERING);
      }
    }
  }


  async onModuleInit() {
    this.deviceClient.subscribeToResponseOf([DeviceTopics.All_DEVICES])
    await this.deviceClient.connect()
  }

}
