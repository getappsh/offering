import { DeviceTypeHierarchyDto, PlatformHierarchyDto } from '@app/common/dto/devices-hierarchy';
import { MicroserviceClient, MicroserviceName } from '@app/common/microservice-client';
import { DevicesHierarchyTopics, OfferingTopicsEmit } from '@app/common/microservice-client/topics';
import { SafeCron } from '@app/common/safe-cron';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceTypeEntity, PlatformEntity } from '@app/common/database/entities';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

export interface HierarchyCacheInvalidateEvent {
  instanceId: string;
  deviceTypeIds?: number[];
  platformIds?: number[];
  removedDeviceTypeIds?: number[];
  removedPlatformIds?: number[];
  all?: boolean;
}

@Injectable()
export class HierarchyCacheService implements OnModuleInit {
  private readonly logger = new Logger(HierarchyCacheService.name);

  private deviceTypeCache = new Map<number, DeviceTypeHierarchyDto>();
  private platformCache = new Map<number, PlatformHierarchyDto>();

  private readonly refreshCron: string;
  private readonly instanceId = randomUUID();

  constructor(
    @Inject(MicroserviceName.DISCOVERY_SERVICE)
    private readonly deviceClient: MicroserviceClient,
    @Inject(MicroserviceName.OFFERING_SERVICE)
    private readonly offeringClient: MicroserviceClient,
    @InjectRepository(DeviceTypeEntity)
    private readonly deviceTypeRepo: Repository<DeviceTypeEntity>,
    @InjectRepository(PlatformEntity)
    private readonly platformRepo: Repository<PlatformEntity>,
    private readonly config: ConfigService,
  ) {
    this.refreshCron = this.config.get('HIERARCHY_CACHE_REFRESH_CRON') ?? '0 */5 * * * *';
  }

  async onModuleInit() {
    // Warm the cache on startup
    this.refreshAllCaches().catch(err => {
      this.logger.warn(`Failed to warm hierarchy cache on startup: ${err?.message ?? err}`);
    });
  }

  async getDeviceTypeHierarchy(deviceTypeId: number): Promise<DeviceTypeHierarchyDto> {
    if (!this.deviceTypeCache.has(deviceTypeId)) {
      await this.refreshDeviceTypes([deviceTypeId]);
    }
    return this.deviceTypeCache.get(deviceTypeId);
  }

  async getPlatformHierarchy(platformId: number): Promise<PlatformHierarchyDto> {
    if (!this.platformCache.has(platformId)) {
      await this.refreshPlatforms([platformId]);
    }
    return this.platformCache.get(platformId);
  }

  /**
   * Called when catalog changes are made locally.
   * Refreshes affected device types in this instance's cache and emits an event for other instances.
   */
  async onDeviceTypesChanged(deviceTypeIds: number[]) {
    await this.refreshDeviceTypes(deviceTypeIds);
    this.emitCacheInvalidation({ deviceTypeIds });
  }

  /**
   * Called when catalog changes are made locally.
   * Refreshes affected platforms in this instance's cache and emits an event for other instances.
   */
  async onPlatformsChanged(platformIds: number[]) {
    await this.refreshPlatforms(platformIds);
    this.emitCacheInvalidation({ platformIds });
  }

  /**
   * Called when catalog changes are made locally.
   * Refreshes all caches in this instance and emits an event for other instances.
   */
  async onCatalogChanged() {
    await this.refreshAllCaches();
    this.emitCacheInvalidation({ all: true });
  }

  /**
   * Handles incoming cache invalidation events from other instances.
   * Ignores events emitted by this instance.
   */
  async handleCacheInvalidateEvent(event: HierarchyCacheInvalidateEvent) {
    if (event.instanceId === this.instanceId) {
      return; // Ignore self-emitted events
    }

    this.logger.log(`Received cache invalidation event from instance ${event.instanceId}`);

    if (event.all) {
      await this.refreshAllCaches();
      return;
    }

    // Keep serving the previously cached value for removed entities.
    // The stale entry is only replaced when an actual update is received,
    // so we intentionally do not evict removedDeviceTypeIds/removedPlatformIds here.

    const tasks: Promise<void>[] = [];
    if (event.deviceTypeIds?.length) {
      tasks.push(this.refreshDeviceTypes(event.deviceTypeIds));
    }
    if (event.platformIds?.length) {
      tasks.push(this.refreshPlatforms(event.platformIds));
    }
    await Promise.all(tasks);
  }

  @SafeCron({
    cronTime: process.env.HIERARCHY_CACHE_REFRESH_CRON ?? '0 */5 * * * *',
    name: 'hierarchy-cache-refresh',
  })
  async refreshAllCaches() {
    this.logger.log('Refreshing hierarchy caches...');

    const [deviceTypes, platforms] = await Promise.all([
      this.deviceTypeRepo.find({ select: { id: true } }),
      this.platformRepo.find({ select: { id: true } }),
    ]);

    // Refresh device type cache
    const dtResults = await Promise.allSettled(
      deviceTypes.map(dt =>
        lastValueFrom(
          this.deviceClient.send<DeviceTypeHierarchyDto>(
            DevicesHierarchyTopics.GET_DEVICE_TYPE_HIERARCHY_TREE,
            { deviceTypeId: dt.id },
          ),
        ).then(tree => ({ id: dt.id, tree })),
      ),
    );

    let dtSuccess = 0;
    for (const result of dtResults) {
      if (result.status === 'fulfilled') {
        this.deviceTypeCache.set(result.value.id, result.value.tree);
        dtSuccess++;
      }
    }

    // Refresh platform cache
    const pResults = await Promise.allSettled(
      platforms.map(p =>
        lastValueFrom(
          this.deviceClient.send<PlatformHierarchyDto>(
            DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
            { platformId: p.id },
          ),
        ).then(tree => ({ id: p.id, tree })),
      ),
    );

    let pSuccess = 0;
    for (const result of pResults) {
      if (result.status === 'fulfilled') {
        this.platformCache.set(result.value.id, result.value.tree);
        pSuccess++;
      }
    }

    this.logger.log(
      `Hierarchy cache refreshed: ${dtSuccess}/${deviceTypes.length} device types, ${pSuccess}/${platforms.length} platforms`,
    );
  }

  /** Invalidate a specific device type from the cache */
  invalidateDeviceType(deviceTypeId: number) {
    this.deviceTypeCache.delete(deviceTypeId);
  }

  /** Invalidate a specific platform from the cache */
  invalidatePlatform(platformId: number) {
    this.platformCache.delete(platformId);
  }

  /** Invalidate all cached entries */
  invalidateAll() {
    this.deviceTypeCache.clear();
    this.platformCache.clear();
  }

  private async refreshDeviceTypes(deviceTypeIds: number[]) {
    const results = await Promise.allSettled(
      deviceTypeIds.map(id =>
        lastValueFrom(
          this.deviceClient.send<DeviceTypeHierarchyDto>(
            DevicesHierarchyTopics.GET_DEVICE_TYPE_HIERARCHY_TREE,
            { deviceTypeId: id },
          ),
        ).then(tree => ({ id, tree })),
      ),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        this.deviceTypeCache.set(result.value.id, result.value.tree);
      } else {
        this.logger.warn(`Failed to refresh device type cache for id ${deviceTypeIds}: ${result.reason}`);
      }
    }
  }

  private async refreshPlatforms(platformIds: number[]) {
    const results = await Promise.allSettled(
      platformIds.map(id =>
        lastValueFrom(
          this.deviceClient.send<PlatformHierarchyDto>(
            DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
            { platformId: id },
          ),
        ).then(tree => ({ id, tree })),
      ),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        this.platformCache.set(result.value.id, result.value.tree);
      } else {
        this.logger.warn(`Failed to refresh platform cache for id ${platformIds}: ${result.reason}`);
      }
    }
  }

  private emitCacheInvalidation(params: { deviceTypeIds?: number[]; platformIds?: number[]; all?: boolean }) {
    const event: HierarchyCacheInvalidateEvent = {
      instanceId: this.instanceId,
      ...params,
    };
    lastValueFrom(
      this.offeringClient.emit(OfferingTopicsEmit.HIERARCHY_CACHE_INVALIDATE, event),
    ).catch(err => {
      this.logger.warn(`Failed to emit cache invalidation event: ${err?.message ?? err}`);
    });
  }
}
