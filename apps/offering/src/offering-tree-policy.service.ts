import { ConflictException, Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { OfferingTreePolicyEntity } from '@app/common/database/entities/offering-tree-policy.entity';
import { UpsertOfferingTreePolicyDto, OfferingTreePolicyDto, OfferingTreePolicyParams } from '@app/common/dto/offering';
import { ReleaseEntity, ReleaseStatusEnum } from '@app/common/database/entities';
import { ReleaseChangedEventDto, ReleaseEventEnum } from '@app/common/dto/upload';
import { HierarchyCacheService } from './hierarchy-cache.service';

@Injectable()
export class OfferingTreePolicyService {

  private readonly logger = new Logger(OfferingTreePolicyService.name);

  constructor(
    @InjectRepository(OfferingTreePolicyEntity) private readonly policyRepository: Repository<OfferingTreePolicyEntity>,
    @InjectRepository(ReleaseEntity) private readonly releaseRepo: Repository<ReleaseEntity>,
    private readonly hierarchyCache: HierarchyCacheService,

  ) {}

  async upsert(dto: UpsertOfferingTreePolicyDto): Promise<OfferingTreePolicyDto> {
    this.logger.debug(`Upserting policy entity: ${JSON.stringify(dto)}`);
    const existingPolicy = await this.policyRepository.findOne({ 
      where: { 
        platform: dto.platformId ? { id: dto.platformId } : IsNull(),
        deviceType: dto.deviceTypeId ? { id: dto.deviceTypeId } : IsNull(),
        project: { id: dto.projectId } 
      }, 
      relations: ['platform', 'deviceType', 'project'],
      select: {
        platform: { id: true },
        deviceType: { id: true },
        project: { id: true },
      }
    });
    
    
    if (dto.catalogId === null || dto.catalogId === undefined){
      this.logger.debug(`CatalogId is null, removing policy ID: ${existingPolicy?.id}`);
      if (!existingPolicy) {
        this.logger.debug(`CatalogId is null, but no existing policy to remove`);
        return new OfferingTreePolicyDto()
      }
      this.policyRepository.remove(existingPolicy);
      existingPolicy.release = null;
      await this.triggerHierarchyCacheInvalidation(dto);
      return OfferingTreePolicyDto.fromEntity(existingPolicy);
    }

    let release = await this.releaseRepo.findOneBy({catalogId: dto.catalogId})
    if (!release){
      throw new NotFoundException(`Version with catalogId: ${dto.catalogId} not found!`);
    }

    if (release.status != ReleaseStatusEnum.RELEASED){
      throw new ForbiddenException(`Version with catalogId: ${dto.catalogId}, is not released!`)
    }


    if (existingPolicy) {
      this.logger.debug(`Policy already exists, updating ID: ${existingPolicy.id}`);
      existingPolicy.release = release;
      await this.policyRepository.save(existingPolicy);
      await this.triggerHierarchyCacheInvalidation(dto);
      return OfferingTreePolicyDto.fromEntity(existingPolicy);

    }else {
      this.logger.debug(`Policy does not exist, creating new policy`);
      const policy = this.policyRepository.create();
      policy.platform = {id: dto.platformId} as any;
      policy.deviceType = {id: dto.deviceTypeId} as any ;
      policy.project = {id: dto.projectId} as any;

      
      policy.release = release
      this.logger.debug(`Creating policy entity: ${JSON.stringify(policy)}`);

      try {
        const savedPolicy = await this.policyRepository.save(policy);
        await this.triggerHierarchyCacheInvalidation(dto);
        return OfferingTreePolicyDto.fromEntity(savedPolicy);
      } catch (error) {
        if (error.code === '23505') { // Unique violation
          throw new ConflictException('A policy with the same platform, device type, and project already exists.');
        }
        throw error;
      }
    }
  }

  /**
   * Refresh the affected hierarchy cache entry after a policy change and broadcast to other instances.
   * When a device type is targeted, invalidate that device type; when a platform is targeted,
   * invalidate that platform. A project-level policy (no device type / platform) can affect any
   * hierarchy that includes the project, so the whole cache is refreshed.
   */
  private async triggerHierarchyCacheInvalidation(dto: UpsertOfferingTreePolicyDto): Promise<void> {
    if (dto.deviceTypeId) {
      await this.hierarchyCache.onDeviceTypesChanged([dto.deviceTypeId]);
    } else if (dto.platformId) {
      await this.hierarchyCache.onPlatformsChanged([dto.platformId]);
    } else {
      await this.hierarchyCache.onCatalogChanged();
    }
  }


  async findByProjects(projectIds: number[]): Promise<OfferingTreePolicyDto[]> {
    this.logger.debug(`Finding policies for project IDs: ${projectIds}`);
    if (projectIds.length === 0) {
      this.logger.debug(`No project IDs provided, returning empty array`);
      return [];
    }
    const policies = await this.policyRepository.find({
      where: { 
        project: { id: In(projectIds) }, 
        deviceType: IsNull(),
        platform: IsNull()
      },
      relations: ['platform', 'deviceType', 'project', 'release'],
      select: {
        platform: { id: true },
        deviceType: { id: true },
        project: { id: true },
        release: { catalogId: true, latest: true},
      }
    });
    return policies.map(policy => OfferingTreePolicyDto.fromEntity(policy));
  } 


  async findBy(params: OfferingTreePolicyParams): Promise<OfferingTreePolicyDto[]> {
    this.logger.debug(`Finding policies with params: ${JSON.stringify(params)}`);
    if (!params.platformId && !params.deviceTypeId && !params.projectId) {
      this.logger.debug(`No parameters provided, returning empty array`);
      return [];
    }

    const where: any = {};
    if (params.platformId) {
      where.platform = { id: params.platformId };
    }else if (params.deviceTypeId ){
      // Platform is empty but deviceType is filled → platform must be null
      where.platform = IsNull();

    }else if (params.projectId){
      // Platform and deviceType are empty but project is filled → platform and deviceType must be null
      where.platform = IsNull();
      where.deviceType = IsNull();
    } 

    if (params.deviceTypeId) {
      where.deviceType = { id: params.deviceTypeId };
    }
    if (params.projectId) {
      where.project = { id: params.projectId };
    }

    const policies = await this.policyRepository.find({ 
      where,
      relations: ['platform', 'deviceType', 'project', 'release'],
      select: {
        platform: { id: true },
        deviceType: { id: true },
        project: { id: true },
        release: { catalogId: true, latest: true},
      }
     });
    return policies.map(policy => OfferingTreePolicyDto.fromEntity(policy));
  }

  releaseChangedEvent(dto: ReleaseChangedEventDto){
    if (dto.event === ReleaseEventEnum.DELETED || dto.event === ReleaseStatusEnum.ARCHIVED){
      this.logger.log(`Release ${dto.catalogId}, was deleted/archived`);
      this.releaseRepo.delete({catalogId: dto.catalogId});
    }

  }
}
