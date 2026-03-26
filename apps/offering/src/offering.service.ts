import {
  ComponentOfferingEntity,
  DeviceComponentEntity,
  DeviceComponentStateEnum,
  DeviceEntity,
  DeviceMapStateEnum,
  DeviceTypeEntity,
  MapEntity,
  MapOfferingEntity,
  OfferingActionEnum,
  PlatformEntity,
  ProjectEntity,
  ProjectType,
  ReleaseEntity,
  ReleaseStatusEnum,
  DeviceMapStateEntity,
} from '@app/common/database/entities';
import { DeviceMapStateDto } from '@app/common/dto/device';
import { DeviceComponentStateDto } from '@app/common/dto/device/dto/device-software.dto';
import { DeviceDto } from '@app/common/dto/device/dto/device.dto';
import {
  DeviceTypeHierarchyDto,
  PlatformHierarchyDto,
} from '@app/common/dto/devices-hierarchy';
import { AppError, ErrorCode } from '@app/common/dto/error';
import { MapDto } from '@app/common/dto/map';
import {
  DeviceComponentsOfferingDto,
  ComponentOfferingRequestDto,
  PushOfferingDto,
  OfferingMapPushResDto,
  OfferingTreePolicyParams,
  BaseDeviceDto
} from '@app/common/dto/offering';
import {
  DeviceTypeOfferingDto,
  DeviceTypeOfferingFilterQuery,
  DeviceTypeOfferingParams,
  GetProjectsOfferingDto,
  OfferingParamsCombined,
  PlatformOfferingDto,
  PlatformOfferingParams,
  ProjectOfferingFilterQuery,
  ProjectRefOfferingDto,
} from '@app/common/dto/offering/dto/offering.dto';
import { ProjectIdentifierParams } from '@app/common/dto/project-management';
import { ComponentV2Dto, ReleaseChangedEventDto } from '@app/common/dto/upload';
import {
  MicroserviceClient,
  MicroserviceName,
} from '@app/common/microservice-client';
import {
  DevicesHierarchyTopics,
  DeviceTopics,
  DeviceTopicsEmit,
  UploadTopics,
} from '@app/common/microservice-client/topics';
import { SafeCron } from '@app/common/safe-cron';
import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { ILike, In, Repository } from 'typeorm';
import { OfferingTreePolicyService } from './offering-tree-policy.service';
import { PaginatedResultDto } from '@app/common/dto/pagination.dto';

@Injectable()
export class OfferingService implements OnModuleInit {
  private readonly logger = new Logger(OfferingService.name);

  constructor(
    @InjectRepository(ReleaseEntity)
    private readonly releaseRepo: Repository<ReleaseEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(PlatformEntity)
    private readonly platformRepo: Repository<PlatformEntity>,
    @InjectRepository(DeviceTypeEntity)
    private readonly deviceTypeRepo: Repository<DeviceTypeEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(ComponentOfferingEntity)
    private readonly compOfferingRepo: Repository<ComponentOfferingEntity>,
    @InjectRepository(DeviceComponentEntity)
    private readonly deviceComponentRepo: Repository<DeviceComponentEntity>,
    @InjectRepository(MapOfferingEntity)
    private readonly mapOfferingRepo: Repository<MapOfferingEntity>,
    @InjectRepository(DeviceMapStateEntity)
    private readonly deviceMapRepo: Repository<DeviceMapStateEntity>,

    @Inject(MicroserviceName.DISCOVERY_SERVICE)
    private readonly deviceClient: MicroserviceClient,
    @Inject(MicroserviceName.UPLOAD_SERVICE)
    private readonly uploadClient: MicroserviceClient,

    private readonly policyService: OfferingTreePolicyService,
    private readonly config: ConfigService,
  ) { }

  async getDeviceComponentOffering(
    dto: ComponentOfferingRequestDto,
  ): Promise<DeviceComponentsOfferingDto> {
    this.logger.log(`Get offering for device: ${dto.deviceId}`);

    const [offering, push] = await Promise.all([
      this.config.get('ALLOW_OFFERING_BY_EXISTING_COMPS') === 'true'
        ? this.getOfferingFromFormationsPlatformsAndComponents(dto)
        : ([] as ReleaseEntity[]),
      this.compOfferingRepo.find({
        select: {
          release: {
            version: true,
            catalogId: true,
            releaseNotes: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            metadata: {},
            project: { id: true, name: true, projectType: true },
            artifacts: { fileUpload: { size: true }, isInstallationFile: true },
          },
        },
        where: {
          device: { ID: dto.deviceId },
          action: OfferingActionEnum.PUSH,
        },
        relations: {
          release: { project: true, artifacts: { fileUpload: true } },
        },
      }),
    ]);

    const res = new DeviceComponentsOfferingDto();
    res.offer = offering
      ?.filter(
        (o) =>
          !dto.components?.includes(o.catalogId) &&
          !push?.some((p) => p?.release?.catalogId == o.catalogId),
      )
      ?.map((o) => ComponentV2Dto.fromEntity(o));

    res.push = push
      ?.filter((p) => !dto.components?.includes(p.release.catalogId))
      ?.map((p) => ComponentV2Dto.fromEntity(p.release));

    // Fetch policies for all releases in offer and push
    await this.enrichReleasesWithPolicies(res.offer);
    await this.enrichReleasesWithPolicies(res.push);

    this.logger.log(
      `Get offering for device: ${dto.deviceId}, offer count: ${res.offer?.length}, push count: ${res.push?.length}`,
    );

    this.setDeviceSoftwaresOffering(
      dto.deviceId,
      res.offer.map((o) => o.id),
      OfferingActionEnum.OFFERING,
    );
    this.sendDeviceSoftwaresState(
      dto.deviceId,
      res.offer.map((o) => o.id),
      DeviceComponentStateEnum.OFFERING,
    );
    return res;
  }

  private async getOfferingFromFormationsPlatformsAndComponents(
    dto: ComponentOfferingRequestDto,
  ): Promise<ReleaseEntity[]> {
    const platformIds = dto.platforms
      ?.filter((s) => /^\d+$/.test(s))
      .map((s) => parseInt(s, 10));

    const projects = await this.projectRepo.find({
      select: { id: true, platforms: false },
      where: [
        {
          releases: { catalogId: In(dto.components ?? []) },
        },
        {
          projectType: ProjectType.PRODUCT,
          platforms: { name: In(dto.platforms ?? []) },
        },
        {
          projectType: ProjectType.PRODUCT,
          platforms: { id: In(platformIds ?? []) },
        },
      ],
    });
    const projectIds = projects.map((p) => p.id);
    this.logger.log(
      `Get offering for device: ${dto.deviceId}, associated projects: ${projectIds}`,
    );

    const offering = await this.releaseRepo.find({
      select: {
        project: { id: true, name: true, projectType: true },
        artifacts: { fileUpload: { size: true }, isInstallationFile: true },
      },
      where: {
        status: ReleaseStatusEnum.RELEASED,
        project: { id: In(projectIds) },
      },
      relations: { project: true, artifacts: { fileUpload: true } },
    });

    return offering;
  }

  // Return the latest release for each component id
  async getUpdatesForComponents(
    components: string[],
  ): Promise<ReleaseEntity[]> {
    this.logger.debug(`Get updates for releaseIds: ${components}`);
    const updates = await this.releaseRepo
      .createQueryBuilder('r')
      .innerJoin(
        (qb) =>
          qb
            .select('re.project_id', 'project_id')
            .addSelect('MAX(re.sort_order)', 'max_sort_order')
            .from(ReleaseEntity, 're')
            .where((sqb) => {
              const subQuery = sqb
                .subQuery()
                .select('DISTINCT r.project_id')
                .from(ReleaseEntity, 'r')
                .where('r.catalog_id IN (:...releaseIds)', {
                  releaseIds: components,
                })
                .getQuery();
              return `re.project_id IN (${subQuery})`;
            })
            .andWhere('re.status = :status', {
              status: ReleaseStatusEnum.RELEASED,
            })
            .groupBy('re.project_id'),
        'latest',
        'r.project_id = latest.project_id AND r.sort_order = latest.max_sort_order',
      )
      .getMany();

    return updates.filter((r) => !components.includes(r.catalogId));
  }

  async getOfferOfComp(catalogId: string) {
    const release = await this.releaseRepo.findOne({
      where: {
        catalogId: catalogId,
        status: ReleaseStatusEnum.RELEASED,
      },
      relations: { project: true, artifacts: { fileUpload: true } },
      select: {
        project: { id: true, name: true, projectType: true },
        artifacts: { fileUpload: { size: true }, isInstallationFile: true },
      },
    });

    if (!release) {
      throw new NotFoundException(`Release ${catalogId} not found`);
    }
    const result = ComponentV2Dto.fromEntity(release);
    await this.enrichReleasesWithPolicies([result]);
    return result;
  }

  async getPushOfferingDevices(catalogId: any): Promise<BaseDeviceDto[]> {
    this.logger.debug(`Getting push offering devices for catalogId: ${catalogId}`);
    const offerings = await this.compOfferingRepo.find({
      where: {
        release: { catalogId },
        action: OfferingActionEnum.PUSH
      },
      relations: { device: true },
    });
    return offerings
      .filter(o => !!o.device?.ID)
      .map(o => ({ deviceId: o.device.ID, deviceName: o.device.name }));
  }

  /**
   * Fetches policies for each release and attaches them to the ComponentV2Dto objects
   * Also recursively enriches any dependencies with their policies
   */
  private async enrichReleasesWithPolicies(
    releases: ComponentV2Dto[],
  ): Promise<void> {
    if (!releases || releases.length === 0) {
      return;
    }

    this.logger.debug(`Fetching policies for ${releases.length} releases`);

    // Fetch policies for all releases in parallel
    const policiesPromises = releases.map((release) =>
      lastValueFrom(
        this.uploadClient.send(
          UploadTopics.GET_POLICIES_FOR_RELEASE,
          release.id,
        ),
      ).catch((err) => {
        this.logger.error(
          `Failed to fetch policies for release ${release.id}: ${err}`,
        );
        return [];
      }),
    );

    const policiesResults = await Promise.all(policiesPromises);

    // Attach policies to each release
    releases.forEach((release, index) => {
      release.policies = policiesResults[index];
    });

    this.logger.debug(`Successfully attached policies to releases`);

    // Recursively enrich dependencies
    for (const release of releases) {
      if (release.dependencies && release.dependencies.length > 0) {
        await this.enrichReleasesWithPolicies(release.dependencies);
      }
    }
  }

  private async getDevicesInGroup(groups: number[]): Promise<string[]> {
    this.logger.debug(`get devices in groups: ${JSON.stringify(groups)}`);
    const devices: DeviceDto[] = await lastValueFrom(
      this.deviceClient.send(DeviceTopics.All_DEVICES, { groups: groups }),
    );
    const ids = devices.map((d) => d.id);
    return ids;
  }

  async pushSoftwareOffering(po: PushOfferingDto) {
    this.logger.debug(`push software offering`);
    const devices = po.devices;
    if (po.groups.length > 0) {
      const idsInGroup = await this.getDevicesInGroup(po.groups);
      devices.push(...idsInGroup);
    }
    await this.setSoftwareOffering(
      devices,
      po.catalogId,
      OfferingActionEnum.PUSH,
    );
    this.sendDeviceSoftwareState(
      devices,
      po.catalogId,
      DeviceComponentStateEnum.PUSH,
    );
  }

  async pushMapOffering(po: PushOfferingDto) {
    this.logger.debug(`push map offering`);
    const devices = po.devices;
    if (po.groups.length > 0) {
      const idsInGroup = await this.getDevicesInGroup(po.groups);
      devices.push(...idsInGroup);
    }

    const mapsOffering = [];
    const devicesState = [];

    for (const id of devices) {
      const entity = this.mapOfferingRepo.create();
      entity.action = OfferingActionEnum.PUSH;
      entity.map = { catalogId: po.catalogId } as MapEntity;
      entity.device = { ID: id } as DeviceEntity;
      mapsOffering.push(entity);

      const deviceState = new DeviceMapStateDto();
      deviceState.state = DeviceMapStateEnum.PUSH;
      deviceState.catalogId = po.catalogId;
      deviceState.deviceId = id;
      devicesState.push(deviceState);
    }
    try {
      await this.mapOfferingRepo.upsert(mapsOffering, ['device', 'map']);
    } catch (err) {
      this.logger.error(`error update map offering, ${err}`);
      return;
    }

    this.logger.log('Send device map state');
    this.deviceClient.emit(
      DeviceTopicsEmit.UPDATE_DEVICE_MAP_STATE,
      devicesState,
    );
  }

  async unpushSoftwareOffering(po: PushOfferingDto) {
    this.logger.debug(`unpush software offering`);
    const devices = [...po.devices];
    if (po.groups.length > 0) {
      const idsInGroup = await this.getDevicesInGroup(po.groups);
      devices.push(...idsInGroup);
    }

    // Deduplicate devices (a device may appear in both devices array and a group)
    const uniqueDevices = [...new Set(devices)];

    this.logger.log(
      `Unpush software offering - catalogId: ${po.catalogId}, number of devices: ${uniqueDevices.length}`,
    );

    // Batch-load all push offerings and device component states upfront to avoid N+1 queries
    const [offerings, deviceComponents] = await Promise.all([
      this.compOfferingRepo.find({
        where: {
          device: { ID: In(uniqueDevices) },
          release: { catalogId: po.catalogId },
          action: OfferingActionEnum.PUSH,
        },
        relations: { device: true },
      }),
      this.deviceComponentRepo.find({
        where: {
          device: { ID: In(uniqueDevices) },
          release: { catalogId: po.catalogId },
        },
        relations: { device: true },
      }),
    ]);

    const offeringByDevice = new Map(
      offerings.map((o) => [o.device.ID, o]),
    );
    const componentByDevice = new Map(
      deviceComponents.map((c) => [c.device.ID, c]),
    );

    for (const deviceId of uniqueDevices) {
      try {
        const offering = offeringByDevice.get(deviceId);
        if (!offering) {
          this.logger.warn(
            `No active push found for device: ${deviceId}, catalogId: ${po.catalogId}`,
          );
          continue;
        }

        const deviceComponent = componentByDevice.get(deviceId);

        if (!deviceComponent) {
          // No component record exists (data inconsistency or race condition) —
          // just remove the push offering
          await this.compOfferingRepo.delete(offering.id);
          this.logger.warn(
            `No component record found for device: ${deviceId}, catalogId: ${po.catalogId}. Removed push offering only.`,
          );
        } else if (deviceComponent.state === DeviceComponentStateEnum.PUSH) {
          // The device did not update this record — it's still a server-side
          // change from the push, so we can safely delete both records
          await this.compOfferingRepo.manager.transaction(async (entityManager) => {
            await entityManager.delete(ComponentOfferingEntity, offering.id);
            await entityManager.delete(DeviceComponentEntity, {
              device: { ID: deviceId },
              release: { catalogId: po.catalogId },
            });
          });
          this.logger.debug(
            `Unpushed and deleted component for device: ${deviceId}, catalogId: ${po.catalogId}`,
          );
        } else {
          // Device has progressed beyond PUSH (e.g. DELIVERY, DOWNLOADED, etc.) —
          // another service / the device itself updated the record, so only remove the push offering.
          // The component record is deliberately left as-is to avoid interrupting an in-progress operation.
          await this.compOfferingRepo.delete(offering.id);
          this.logger.debug(
            `Unpushed offering for device: ${deviceId}, catalogId: ${po.catalogId} ` +
            `(component state: ${deviceComponent.state}, left as-is)`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error unpushing software offering for device: ${deviceId}, catalogId: ${po.catalogId}. Error: ${error}`,
        );
      }
    }
  }

  async unpushMapOffering(po: PushOfferingDto) {
    this.logger.debug(`unpush map offering`);
    const devices = [...po.devices];
    if (po.groups.length > 0) {
      const idsInGroup = await this.getDevicesInGroup(po.groups);
      devices.push(...idsInGroup);
    }

    // Deduplicate devices (a device may appear in both devices array and a group)
    const uniqueDevices = [...new Set(devices)];

    this.logger.log(
      `Unpush map offering - catalogId: ${po.catalogId}, number of devices: ${uniqueDevices.length}`,
    );

    // Batch-load all map push offerings and device map states upfront to avoid N+1 queries
    const [offerings, deviceMaps] = await Promise.all([
      this.mapOfferingRepo.find({
        where: {
          device: { ID: In(uniqueDevices) },
          map: { catalogId: po.catalogId },
          action: OfferingActionEnum.PUSH,
        },
        relations: { device: true },
      }),
      this.deviceMapRepo.find({
        where: {
          device: { ID: In(uniqueDevices) },
          map: { catalogId: po.catalogId },
        },
        relations: { device: true },
      }),
    ]);

    const offeringByDevice = new Map(
      offerings.map((o) => [o.device.ID, o]),
    );
    const mapStateByDevice = new Map(
      deviceMaps.map((m) => [m.device.ID, m]),
    );

    const devicesState: DeviceMapStateDto[] = [];

    for (const deviceId of uniqueDevices) {
      try {
        const offering = offeringByDevice.get(deviceId);
        if (!offering) {
          this.logger.warn(
            `No active map push found for device: ${deviceId}, catalogId: ${po.catalogId}`,
          );
          continue;
        }

        const deviceMap = mapStateByDevice.get(deviceId);

        if (!deviceMap) {
          // No map state record exists — just remove the push offering
          await this.mapOfferingRepo.delete(offering.id);
          this.logger.warn(
            `No map state record found for device: ${deviceId}, catalogId: ${po.catalogId}. Removed push offering only.`,
          );
        } else if (deviceMap.state === DeviceMapStateEnum.PUSH) {
          // The device did not act on this push yet — safe to delete both records
          await this.mapOfferingRepo.manager.transaction(async (entityManager) => {
            await entityManager.delete(MapOfferingEntity, offering.id);
            await entityManager.delete(DeviceMapStateEntity, {
              device: { ID: deviceId },
              map: { catalogId: po.catalogId },
            });
          });
          this.logger.debug(
            `Unpushed and deleted map state for device: ${deviceId}, catalogId: ${po.catalogId}`,
          );

          const deviceState = new DeviceMapStateDto();
          deviceState.state = DeviceMapStateEnum.OFFERING;
          deviceState.catalogId = po.catalogId;
          deviceState.deviceId = deviceId;
          deviceState.error = null;
          devicesState.push(deviceState);
        } else if (deviceMap.state === DeviceMapStateEnum.DELIVERY) {
          // Device is in DELIVERY state — remove the push offering but leave the map state as-is.
          await this.mapOfferingRepo.delete(offering.id);
          this.logger.debug(
            `Unpushed map offering for device: ${deviceId}, catalogId: ${po.catalogId} ` +
            `(map state: ${deviceMap.state}, left as-is)`,
          );
        } else {
          // Device has progressed beyond DELIVERY (e.g. DOWNLOADED, etc.) —
          // another service / the device itself updated the record, so leave everything as-is
          // to avoid interrupting an in-progress operation.
          this.logger.debug(
            `Skipped unpush for device: ${deviceId}, catalogId: ${po.catalogId} ` +
            `(map state: ${deviceMap.state}, left as-is)`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error unpushing map offering for device: ${deviceId}, catalogId: ${po.catalogId}. Error: ${error}`,
        );
      }
    }

    if (devicesState.length > 0) {
      this.logger.log('Send device map state updates');
      this.deviceClient.emit(
        DeviceTopicsEmit.UPDATE_DEVICE_MAP_STATE,
        devicesState,
      );
    }
  }

  private async setDeviceSoftwaresOffering(
    deviceId: string,
    catalogIds: string[],
    action: OfferingActionEnum,
  ) {
    this.logger.debug(
      `Set device software offering deviceId: ${deviceId}, catalogIds: ${catalogIds}, action: ${action}`,
    );
    const entities = [];

    for (const ci of catalogIds) {
      const entity = this.compOfferingRepo.create();
      entity.action = action;
      entity.release = { catalogId: ci } as ReleaseEntity;
      entity.device = { ID: deviceId } as DeviceEntity;
      entities.push(entity);
    }

    await this.compOfferingRepo.manager
      .transaction(async (entityManager) => {
        await entityManager
          .createQueryBuilder()
          .delete()
          .from(ComponentOfferingEntity)
          .where('device_ID = :deviceId', { deviceId })
          .andWhere('action = :action', { action })
          .execute();

        if (action === OfferingActionEnum.PUSH) {
          await entityManager.upsert(ComponentOfferingEntity, entities, [
            'device',
            'release',
          ]);
        } else {
          await entityManager
            .createQueryBuilder()
            .insert()
            .into(ComponentOfferingEntity)
            .values(entities)
            .orIgnore()
            .execute();
        }
      })
      .catch((err) =>
        this.logger.error(`Failed to set device software offering: ${err}`),
      );
  }

  private async sendDeviceSoftwaresState(
    deviceId: string,
    catalogIds: string[],
    state: DeviceComponentStateEnum,
  ) {
    this.logger.debug(
      `Send device software state deviceId: ${deviceId}, catalogIds: ${catalogIds}, state: ${state}`,
    );
    const devicesState = [];

    for (const catalogId of catalogIds) {
      const deviceState = new DeviceComponentStateDto();
      deviceState.state = state;
      deviceState.catalogId = catalogId;
      deviceState.deviceId = deviceId;
      devicesState.push(deviceState);
    }

    const batchSize = 15;
    for (let i = 0; i < devicesState.length; i += batchSize) {
      const batch = devicesState.slice(i, i + batchSize);
      this.logger.debug(
        `Send device software state from index ${i} to ${i + batchSize - 1}:`,
      );
      this.deviceClient.emit(
        DeviceTopicsEmit.UPDATE_DEVICE_SOFTWARE_STATE,
        batch,
      );
    }
  }

  async setSoftwareOffering(
    devices: string[],
    catalogId: string,
    action: OfferingActionEnum,
  ) {
    this.logger.log(
      `Update software offering - software: ${catalogId}, action: ${action}, number of devices: ${devices.length}`,
    );

    const compsOffering = [];
    for (const id of devices) {
      const entity = this.compOfferingRepo.create();
      entity.action = action;
      entity.release = { catalogId: catalogId } as ReleaseEntity;
      entity.device = { ID: id } as DeviceEntity;
      compsOffering.push(entity);
    }

    try {
      if (action === OfferingActionEnum.PUSH) {
        await this.compOfferingRepo.upsert(compsOffering, [
          'device',
          'release',
        ]);
      } else if (action === OfferingActionEnum.OFFERING) {
        await this.compOfferingRepo
          .createQueryBuilder()
          .insert()
          .values(compsOffering)
          .orIgnore()
          .execute();
      }
    } catch (err) {
      this.logger.error(`error update comp offering, ${err}`);
      return;
    }
  }

  async sendDeviceSoftwareState(
    devices: string[],
    catalogId: string,
    state: DeviceComponentStateEnum,
  ) {
    this.logger.log(
      `Send software state - software: ${catalogId}, state: ${state}, number of devices: ${devices.length}`,
    );

    const devicesState = [];
    for (const id of devices) {
      const deviceState = new DeviceComponentStateDto();
      deviceState.state = state;
      deviceState.catalogId = catalogId;
      deviceState.deviceId = id;
      devicesState.push(deviceState);
    }

    const batchSize = 15;
    for (let i = 0; i < devicesState.length; i += batchSize) {
      const batch = devicesState.slice(i, i + batchSize);
      this.logger.debug(
        `Send devices software state from index ${i} to ${i + batchSize - 1}:`,
      );
      this.deviceClient.emit(
        DeviceTopicsEmit.UPDATE_DEVICE_SOFTWARE_STATE,
        batch,
      );
    }
  }

  async getDeviceMapOffering(deviceId: string) {
    this.logger.log('get device map offering');
    const maps = await this.mapOfferingRepo.find({
      where: { device: { ID: deviceId } },
      relations: { map: { mapProduct: true } },
    });

    const deviceOffering = new OfferingMapPushResDto();
    deviceOffering.push = maps
      .filter((dm) => dm.action == OfferingActionEnum.PUSH)
      .map((dm) => MapDto.fromMapEntity(dm.map));

    return deviceOffering;
  }

  async deviceSoftwareEvent(event: DeviceComponentStateDto) {
    this.logger.debug(
      `device: ${event.deviceId}, component: ${event.catalogId}, event: ${event.state}`,
    );
    if (event.state === DeviceComponentStateEnum.INSTALLED) {
      this.logger.debug(
        `delete comp: ${event.catalogId} offering form device: ${event.deviceId}`,
      );
      this.compOfferingRepo.delete({
        release: { catalogId: event.catalogId },
        device: { ID: event.deviceId },
      });
    }
  }

  async deviceMapEvent(event: DeviceMapStateDto) {
    this.logger.debug(
      `device: ${event.deviceId}, map: ${event.catalogId}, event: ${event.state}`,
    );
    if (event.state === DeviceMapStateEnum.INSTALLED) {
      this.logger.debug(
        `delete map: ${event.catalogId} offering form device: ${event.deviceId}`,
      );
      this.mapOfferingRepo.delete({
        map: { catalogId: event.catalogId },
        device: { ID: event.deviceId },
      });
    }
  }

  // // TODO pagination
  private getDevicesByPlatformsFormationsAndComponents(
    platforms: string[],
    projects: number[],
  ): Promise<DeviceEntity[]> {
    return this.deviceRepo.find({
      select: { ID: true },
      where: [
        { components: { release: { project: { id: In(projects) } } } },
        { platform: { name: In(platforms) } },
      ],
    });
  }

  async releaseChangedEvent(dto: ReleaseChangedEventDto) {
    if (dto.event === ReleaseStatusEnum.RELEASED) {
      const project = await this.projectRepo.findOneBy({
        releases: { catalogId: dto.catalogId },
      });

      const platforms = project.platforms?.map((p) => p.name);

      const device = await this.getDevicesByPlatformsFormationsAndComponents(
        platforms,
        [project.id],
      );

      const ids = device.map((d) => d.ID);
      this.logger.debug(
        `set comp: ${dto.catalogId} offering on devices: ${ids}`,
      );

      await this.setSoftwareOffering(
        ids,
        dto.catalogId,
        OfferingActionEnum.OFFERING,
      );
      this.sendDeviceSoftwareState(
        ids,
        dto.catalogId,
        DeviceComponentStateEnum.OFFERING,
      );
    } else {
      this.logger.debug(`delete comp: ${dto.catalogId} offering form devices`);
      this.compOfferingRepo.delete({ release: { catalogId: dto.catalogId } });
      this.deviceClient.emit(DeviceTopicsEmit.RELEASE_CHANGED_EVENT, dto);
    }
  }

  async getOfferingForPlatform(
    params: OfferingParamsCombined,
  ): Promise<PlatformOfferingDto> {
    this.logger.log(`get offering for platform: ${params.platformIdentifier}`);
    const platformId = await this.getPlatformIdByParams(params);

    let tree: PlatformHierarchyDto;
    try {
      tree = await lastValueFrom(
        this.deviceClient.send(
          DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
          { platformId: platformId },
        ),
      );
    } catch (e) {
      this.logger.error(
        `get offering for platform: ${params.platformIdentifier} error: ${e}`,
      );
      throw new InternalServerErrorException(
        `get offering for platform: ${params.platformIdentifier} error: ${e}`,
      );
    }
    const policies = await this.policyService.findBy({ platformId });
    this.logger.debug(
      `platform offering policies: ${JSON.stringify(policies)}`,
    );

    const missingFromPolicies = tree.deviceTypes
      .filter(dt =>
        dt.projects
          .filter(p => !policies.some(
            policy =>
              policy.projectId === p.projectId &&
              policy.deviceTypeId === dt.deviceTypeId
          )).length > 0
      ).map(dt => dt.deviceTypeId);

    const deviceTypePolicies = (await Promise.all(
      missingFromPolicies.map(dt => this.policyService.findBy({ deviceTypeId: dt }))
    )).flat()

    deviceTypePolicies.forEach(dtp => {
      if (!policies.find(p => p.deviceTypeId === dtp.deviceTypeId && p.projectId === dtp.projectId)) {
        policies.push(dtp);
      }
    })

    const projects = tree.deviceTypes
      .flatMap(dt =>
        dt.projects
          .filter(p => !policies.some(
            policy =>
              policy.projectId === p.projectId &&
              policy.deviceTypeId === dt.deviceTypeId
          ))
          .map(p => p.projectId)
      );

    const [policyOfferingProject, offering] = await Promise.all([
      this.getComponents(policies.map(p => p.catalogId), params.withDependencies),
      this.getOfferingForProjectsByIds(projects, params.withDependencies)
    ]);
    const policyOfferingCatalog = new Map(
      Array.from(policyOfferingProject).map(([_, v]) => [v.id, v]),
    );

    const platformOffering = PlatformOfferingDto.fromPlatformHierarchyDto(tree);

    platformOffering.deviceTypes?.map((dt) => {
      dt.projects?.map((p) => {
        const catalogId = policies.find(
          (po) =>
            po.projectId == p.projectId && po.deviceTypeId == dt.deviceTypeId,
        )?.catalogId;
        if (catalogId) {
          p.release = policyOfferingCatalog.get(catalogId);
        }

        if (!p.release) {
          p.release = offering.get(p.projectId);
        }
      });
    });
    return platformOffering;
  }

  async getOfferingForDeviceType(
    query: DeviceTypeOfferingFilterQuery,
  ): Promise<DeviceTypeOfferingDto> {
    this.logger.log(`get offering for device type: ${JSON.stringify(query)}`);

    const deviceTypeId = await this.getDeviceTypeIdByParams(
      query as DeviceTypeOfferingParams,
    );

    let tree: DeviceTypeHierarchyDto;
    try {
      tree =
        query.deviceTypeTree && Object.keys(query.deviceTypeTree).length > 0
          ? query.deviceTypeTree
          : await lastValueFrom(
            this.deviceClient.send(
              DevicesHierarchyTopics.GET_DEVICE_TYPE_HIERARCHY_TREE,
              { deviceTypeId: deviceTypeId },
            ),
          );
      delete query.deviceTypeTree;
    } catch (e) {
      this.logger.error(
        `get offering for device type: ${query.deviceTypeIdentifier} error: ${e}`,
      );
      throw new InternalServerErrorException(
        `get offering for device type: ${query.deviceTypeIdentifier} error: ${e}`,
      );
    }
    const findByQuery = new OfferingTreePolicyParams();
    findByQuery.deviceTypeId = deviceTypeId;

    if (query.platformIdentifier) {
      findByQuery.platformId = await this.getPlatformIdByParams(
        query as PlatformOfferingParams,
      );
      this.logger.verbose(`Platform id: ${findByQuery.platformId}`);

      this.logger.log(`Get hierarchy tree for platform`);
      let tree: PlatformHierarchyDto;
      try {
        tree = await lastValueFrom(
          this.deviceClient.send(
            DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
            { platformId: findByQuery.platformId },
          ),
        );
      } catch (e) {
        this.logger.error(
          `get offering for platform: ${query.platformIdentifier} error: ${e}`,
        );
        throw new InternalServerErrorException(
          `get offering for platform: ${query.platformIdentifier} error: ${e}`,
        );
      }

      if (
        !tree.deviceTypes.find(
          (d) => d.deviceTypeId === findByQuery.deviceTypeId,
        )
      ) {
        throw new NotFoundException(
          `Platform: '${query.deviceTypeIdentifier}' dose not have DeviceType: '${query.deviceTypeIdentifier}' as offering`,
        );
      }
    }

    let policies = await this.policyService.findBy(findByQuery);
    if (!policies.length && findByQuery.platformId) {
      findByQuery.platformId = undefined;
      policies = await this.policyService.findBy(findByQuery);
    }
    this.logger.debug(`offering policies: ${JSON.stringify(policies)}`);

    let projectIds = tree.projects.map((p) => p.projectId);
    projectIds = projectIds.filter(
      (p) => !policies.some((policy) => policy.projectId == p),
    );

    const componentOffering = await Promise.all([
      this.getComponents(policies.map(p => p.catalogId), query.withDependencies),
      this.getOfferingForProjectsByIds(projectIds, query.withDependencies)
    ]).then(([components, offering]) => new Map([...components, ...offering]));

    const deviceTypeOffering =
      DeviceTypeOfferingDto.fromDeviceTypeHierarchyDto(tree);

    deviceTypeOffering.projects?.map((p) => {
      p.release = componentOffering.get(p.projectId);
    });

    return deviceTypeOffering;
  }

  async getOfferingForProject(
    query: ProjectOfferingFilterQuery,
  ): Promise<ProjectRefOfferingDto> {
    this.logger.log(
      `get offering for project: ${
        query.projectIdentifier
      }, filter by ${JSON.stringify(query)}`,
    );
    const findByQuery = new OfferingTreePolicyParams();

    let project: ProjectEntity | undefined;
    if (typeof query.projectIdentifier === 'string') {
      project = await this.projectRepo.findOne({
        where: { name: query.projectIdentifier },
        relations: { label: true },
      });
    } else {
      project = await this.projectRepo.findOne({
        where: { id: query.projectIdentifier },
        relations: { label: true },
      });
    }

    if (!project) {
      this.logger.error(
        `get offering for project: ${query.projectIdentifier} not found`,
      );
      throw new NotFoundException(
        `get offering for project: ${query.projectIdentifier} not found`,
      );
    }

    findByQuery.projectId = project?.id;

    if (query.platformIdentifier) {
      findByQuery.platformId = await this.getPlatformIdByParams(
        query as PlatformOfferingParams,
      );
      this.logger.verbose(`Platform id: ${findByQuery.platformId}`);
    }

    if (query.deviceTypeIdentifier) {
      findByQuery.deviceTypeId = await this.getDeviceTypeIdByParams(
        query as DeviceTypeOfferingParams,
      );
      this.logger.verbose(`DeviceType id: ${findByQuery.deviceTypeId}`);
    }

    if (findByQuery.deviceTypeId) {
      if (findByQuery.platformId) {
        this.logger.log(`Get hierarchy tree for platform`);
        let tree: PlatformHierarchyDto;
        try {
          tree = await lastValueFrom(
            this.deviceClient.send(
              DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
              { platformId: findByQuery.platformId },
            ),
          );
        } catch (e) {
          this.logger.error(
            `get offering for platform: ${query.platformIdentifier} error: ${e}`,
          );
          throw new InternalServerErrorException(
            `get offering for platform: ${query.platformIdentifier} error: ${e}`,
          );
        }

        if (
          !tree.deviceTypes
            .find((d) => d.deviceTypeId === findByQuery.deviceTypeId)
            ?.projects.find((p) => p.projectId === project?.id)
        ) {
          throw new NotFoundException(
            `Platform: '${query.deviceTypeIdentifier}' dose not have DeviceType: '${query.deviceTypeIdentifier}' and project: '${query.projectIdentifier}' as offering`,
          );
        }
      } else {
        this.logger.log(`Get hierarchy tree for deviceType`);

        let tree: DeviceTypeHierarchyDto;
        try {
          tree = await lastValueFrom(
            this.deviceClient.send(
              DevicesHierarchyTopics.GET_DEVICE_TYPE_HIERARCHY_TREE,
              { deviceTypeId: findByQuery.deviceTypeId },
            ),
          );
        } catch (e) {
          this.logger.error(
            `get offering for device type: ${query.deviceTypeIdentifier} error: ${e}`,
          );
          throw new InternalServerErrorException(
            `get offering for device type: ${query.deviceTypeIdentifier} error: ${e}`,
          );
        }
        if (!tree.projects?.find((p) => p.projectId === project?.id)) {
          throw new NotFoundException(
            `Device type: '${query.deviceTypeIdentifier}' dose not have project: '${query.projectIdentifier}' as offering`,
          );
        }
      }
    }

    let policy = await this.policyService.findBy(findByQuery);

    if (!policy.length && findByQuery.platformId) {
      this.logger.debug(
        `Policy was not found with the following conditions: ${JSON.stringify(
          findByQuery,
        )}, removing platform condition`,
      );
      findByQuery.platformId = undefined;
      policy = await this.policyService.findBy(findByQuery);
    }

    if (!policy.length && findByQuery.deviceTypeId) {
      this.logger.debug(
        `Policy was not found with the following conditions: ${JSON.stringify(
          findByQuery,
        )}, removing device-type condition`,
      );
      findByQuery.deviceTypeId = undefined;
      policy = await this.policyService.findBy(findByQuery);
    }

    let offering;
    if (policy?.length > 0) {
      offering = await this.getComponents(policy.map(p => p.catalogId), query.withDependencies);
    } else {
      offering = await this.getLatestReleaseOfProjects([project.id], query.withDependencies);
    }

    const projectOffering = new ProjectRefOfferingDto();
    projectOffering.projectId = project.id;
    projectOffering.projectName = project.name;
    projectOffering.displayName = project.projectName;
    projectOffering.label = project.label?.name;

    projectOffering.release = offering.get(project.id);

    return projectOffering;
  }

  async getOfferingForProjects(
    dto: GetProjectsOfferingDto,
  ): Promise<PaginatedResultDto<ProjectRefOfferingDto>> {
    this.logger.log(`get offering for projects`);

    const whereCondition: any = {};
    if (dto.query && dto.query.trim() !== '') {
      whereCondition.name = ILike(`%${dto.query}%`);
    }

    const [projects, total] = await this.projectRepo.findAndCount({
      select: {
        id: true,
        name: true,
        projectType: true,
        projectName: true,
        label: { id: true, name: true },
      },
      where: whereCondition,
      relations: { label: true },
      skip: (dto.page - 1) * dto.perPage,
      take: dto.perPage,
      order: { id: 'ASC' },
    });
    
    let projectIds = projects.map((p) => p.id);

    const policies = await this.policyService.findByProjects(projectIds);

    projectIds = projectIds.filter(
      (id) => !policies.some((policy) => policy.projectId == id),
    );

    const componentOffering = await Promise.all([
      this.getComponents(policies.map((p) => p.catalogId)),
      this.getLatestReleaseOfProjects(projectIds),
    ]).then(([components, offering]) => new Map([...components, ...offering]));

    const projectOfferings = projects.map((p) => {
      const projectOffering = new ProjectRefOfferingDto();
      projectOffering.projectId = p.id;
      projectOffering.projectName = p.name;
      projectOffering.displayName = p.projectName;
      projectOffering.label = p.label?.name;
      projectOffering.release = componentOffering.get(p.id);
      return projectOffering;
    });

    const res = new PaginatedResultDto<ProjectRefOfferingDto>();
    res.data = projectOfferings;
    res.total = total;
    res.page = dto.page;
    res.perPage = dto.perPage;
    return res;
  }

  private async getDeviceTypeIdByParams(
    params: DeviceTypeOfferingParams,
  ): Promise<number> {
    if (typeof params.deviceTypeIdentifier === 'string') {
      const deviceType = await this.deviceTypeRepo.findOneBy({
        name: params.deviceTypeIdentifier,
      });
      if (!deviceType) {
        throw new NotFoundException(
          `get offering for device type: ${params.deviceTypeIdentifier} not found`,
        );
      }
      return deviceType.id;
    } else {
      return params.deviceTypeIdentifier;
    }
  }

  private async getPlatformIdByParams(
    params: OfferingParamsCombined,
  ): Promise<number> {
    if (typeof params.platformIdentifier === 'string') {
      const platform = await this.platformRepo.findOneBy({
        name: params.platformIdentifier,
      });
      if (!platform) {
        throw new AppError(
          ErrorCode.DEVICE_PLATFORM_NOT_FOUND,
          `get offering for platform: ${params.platformIdentifier} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return platform.id;
    } else {
      return params.platformIdentifier;
    }
  }

  private async getOfferingForProjectsByIds(projectIds: number[], withDependencies: boolean): Promise<Map<number, ComponentV2Dto>> {
    this.logger.debug(`Get offering for projects by ids: ${JSON.stringify(projectIds)}`)
    let policies = await this.policyService.findByProjects(projectIds);

    projectIds = projectIds.filter(
      (id) => !policies.some((policy) => policy.projectId == id),
    );

    const componentOffering = await Promise.all([
      this.getComponents(policies.map(p => p.catalogId), withDependencies),
      this.getLatestReleaseOfProjects(projectIds, withDependencies)
    ]).then(([components, offering]) => new Map([...components, ...offering]));
    return componentOffering;
  }

  private async fetchReleasesByCatalogIds(catalogIds: string[], includeDependencies: boolean = false, visited: Set<string> = new Set()): Promise<ReleaseEntity[]> {
    // Filter out already visited catalog IDs to avoid infinite loops
    const toFetch = catalogIds.filter(id => !visited.has(id));

    if (toFetch.length === 0) {
      return [];
    }

    // Mark these as visited
    toFetch.forEach(id => visited.add(id));

    const select: any = {
      project: { id: true, name: true, projectType: true },
      artifacts: { fileUpload: { size: true }, isInstallationFile: true }
    };

    if (includeDependencies) {
      select.dependencies = { catalogId: true, version: true, project: { id: true, name: true, projectType: true }, artifacts: { fileUpload: { size: true }, isInstallationFile: true } };
    }

    const relations: any = { project: true, artifacts: { fileUpload: true } };
    if (includeDependencies) {
      relations.dependencies = { project: true, artifacts: { fileUpload: true } };
    }

    const releases = await this.releaseRepo.find({
      select,
      where: {
        status: ReleaseStatusEnum.RELEASED,
        catalogId: In(toFetch),
      },
      relations,
    });

    // If we need to fetch dependencies recursively
    if (includeDependencies) {
      for (const release of releases) {
        if (release.dependencies?.length > 0) {
          const dependencyCatalogIds = release.dependencies.map(d => d.catalogId);
          const nestedReleases = await this.fetchReleasesByCatalogIds(dependencyCatalogIds, true, visited);
          release.dependencies = nestedReleases;
        }
      }
    }

    return releases;
  }


  private async getLatestReleaseOfProjects(projects: number[], withDependencies?: boolean): Promise<Map<number, ComponentV2Dto>> {
    this.logger.debug(`get offering for projects: ${JSON.stringify(projects)}`);
    const releases = await this.releaseRepo.find({
      select: {
        catalogId: true,
        project: { id: true, name: true, projectType: true, projectName: true, label: { id: true, name: true } },
        artifacts: { fileUpload: { size: true }, isInstallationFile: true },
        dependencies: { catalogId: true }
      },
      where: {
        status: ReleaseStatusEnum.RELEASED,
        project: { id: In(projects) },
        latest: true,
      },
      relations: { project: { label: true }, artifacts: { fileUpload: true }, dependencies: true },
    });

    // Fetch recursive dependencies for all releases
    const catalogIds = releases.map(r => r.catalogId);
    const releasesWithDeps = await this.fetchReleasesByCatalogIds(catalogIds, withDependencies);

    this.logger.verbose(`offering for projects: ${JSON.stringify(releases.map(r => r.catalogId))}`);
    const resultMap = new Map<number, ComponentV2Dto>();

    releasesWithDeps.forEach(r => {
      if (r.project?.id) {
        resultMap.set(r.project.id, ComponentV2Dto.fromEntity(r));
      }
    });

    // Enrich all releases with policies
    const components = Array.from(resultMap.values());
    await this.enrichReleasesWithPolicies(components);

    return resultMap;
  }

  private async getComponents(catalogIds: string[], withDependencies?: boolean): Promise<Map<number, ComponentV2Dto>> {
    this.logger.debug(`get components: ${JSON.stringify(catalogIds)}`);
    const releases = await this.fetchReleasesByCatalogIds(catalogIds, withDependencies);
    const componentMap = new Map<number, ComponentV2Dto>();
    releases.forEach(r => {
      if (r.project?.id) {
        componentMap.set(r.project.id, ComponentV2Dto.fromEntity(r));
      }
    });

    // Enrich all components with policies
    const components = Array.from(componentMap.values());
    await this.enrichReleasesWithPolicies(components);

    return componentMap;
  }

  @SafeCron({
    cronTime: process.env.COMPONENT_OFFERING_JOB_TIME ?? '0 0 * * * *',
    name: 'device-component-offering',
  })
  async offeringComponentTask() {
    this.logger.log(`Start offering component task`);
    const projects = await this.projectRepo.find({
      select: { releases: { catalogId: true }, platforms: { name: true } },
      where: { releases: { status: ReleaseStatusEnum.RELEASED } },
      relations: { releases: true },
    });

    for (const project of projects) {
      const platforms = project.platforms?.map((p) => p.name);
      const devices = await this.getDevicesByPlatformsFormationsAndComponents(
        platforms,
        [project.id],
      );

      const ids = devices.map((d) => d.ID);
      for (const release of project.releases) {
        this.logger.debug(
          `set comp: ${release.catalogId} offering on devices: ${ids}`,
        );
        await this.setSoftwareOffering(
          ids,
          release.catalogId,
          OfferingActionEnum.OFFERING,
        );
        this.sendDeviceSoftwareState(
          ids,
          release.catalogId,
          DeviceComponentStateEnum.OFFERING,
        );
      }
    }
  }

  async onModuleInit() {
    this.deviceClient.subscribeToResponseOf([
      DeviceTopics.All_DEVICES,
      DevicesHierarchyTopics.GET_DEVICE_TYPE_HIERARCHY_TREE,
      DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
    ]);
    await this.deviceClient.connect();

    this.uploadClient.subscribeToResponseOf([
      UploadTopics.GET_POLICIES_FOR_RELEASE,
    ]);
    await this.uploadClient.connect();
  }
}
