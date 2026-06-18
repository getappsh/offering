import { DeviceTypeHierarchyDto, PlatformHierarchyDto } from '@app/common/dto/devices-hierarchy';
import { MicroserviceClient, MicroserviceName } from '@app/common/microservice-client';
import { DevicesHierarchyTopics } from '@app/common/microservice-client/topics';
import { SafeCron } from '@app/common/safe-cron';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceTypeEntity, PlatformEntity } from '@app/common/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class HierarchyCacheService implements OnModuleInit {
  private readonly logger = new Logger(HierarchyCacheService.name);

  private deviceTypeCache = new Map<number, DeviceTypeHierarchyDto>();
  private platformCache = new Map<number, PlatformHierarchyDto>();

  private readonly refreshCron: string;

  constructor(
    @Inject(MicroserviceName.DISCOVERY_SERVICE)
    private readonly deviceClient: MicroserviceClient,
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
    const cached = this.deviceTypeCache.get(deviceTypeId);
    if (cached) {
      return cached;
    }

    // Cache miss — fetch from discovery and cache
    const tree = await lastValueFrom(
      this.deviceClient.send<DeviceTypeHierarchyDto>(
        DevicesHierarchyTopics.GET_DEVICE_TYPE_HIERARCHY_TREE,
        { deviceTypeId },
      ),
    );
    this.deviceTypeCache.set(deviceTypeId, tree);
    return tree;
  }

  async getPlatformHierarchy(platformId: number): Promise<PlatformHierarchyDto> {
    const cached = this.platformCache.get(platformId);
    if (cached) {
      return cached;
    }

    // Cache miss — fetch from discovery and cache
    const tree = await lastValueFrom(
      this.deviceClient.send<PlatformHierarchyDto>(
        DevicesHierarchyTopics.GET_PLATFORM_HIERARCHY_TREE,
        { platformId },
      ),
    );
    this.platformCache.set(platformId, tree);
    return tree;
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
}
