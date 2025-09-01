import { ConflictException, Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferingTreePolicyEntity } from '@app/common/database/entities/offering-tree-policy.entity';
import { CreateOfferingTreePolicyDto, OfferingTreePolicyDto, OfferingTreePolicyParams, UpdateOfferingTreePolicyDto } from '@app/common/dto/offering';
import { ReleaseEntity, ReleaseStatusEnum } from '@app/common/database/entities';
import { ReleaseChangedEventDto, ReleaseEventEnum } from '@app/common/dto/upload';

@Injectable()
export class OfferingTreePolicyService {

  private readonly logger = new Logger(OfferingTreePolicyService.name);

  constructor(
    @InjectRepository(OfferingTreePolicyEntity) private readonly policyRepository: Repository<OfferingTreePolicyEntity>,
    @InjectRepository(ReleaseEntity) private readonly releaseRepo: Repository<ReleaseEntity>,

  ) {}

  async create(createDto: CreateOfferingTreePolicyDto): Promise<OfferingTreePolicyDto> {
    const policy = this.policyRepository.create();
    policy.platform = {id: createDto.platformId} as any;
    policy.deviceType = {id: createDto.deviceTypeId} as any ;
    policy.project = {id: createDto.projectId} as any;

    let release = await this.releaseRepo.findOneBy({catalogId: createDto.catalogId})
    if (!release){
      throw new NotFoundException(`Version with catalogId: ${createDto.catalogId} not found!`);
    }
    if (release.status != ReleaseStatusEnum.RELEASED){
      throw new ForbiddenException(`Version with catalogId: ${createDto.catalogId}, is not released!`)
    }
    policy.release = release

    this.logger.debug(`Creating policy entity: ${JSON.stringify(policy)}`);

    try {
      const savedPolicy = await this.policyRepository.save(policy);
      return OfferingTreePolicyDto.fromEntity(savedPolicy);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new ConflictException('A policy with the same platform, device type, and project already exists.');
      }
      throw error;
    }
  }

  async findOne(id: number): Promise<OfferingTreePolicyDto> {
    const policy = await this.policyRepository.findOne({ 
      where: { id }, 
      relations: ['platform', 'deviceType', 'project', 'release'],
      select: {
        platform: { id: true },
        deviceType: { id: true },
        project: { id: true },
        release: { catalogId: true },
      }
    });
    if (!policy) {
      throw new NotFoundException(`Device platform version policy with ID ${id} not found`);
    }
    return OfferingTreePolicyDto.fromEntity(policy);
  }

  async update(updateDto: UpdateOfferingTreePolicyDto): Promise<OfferingTreePolicyDto> {
    this.logger.debug(`Updating policy entity: ${JSON.stringify(updateDto)}`);
    const policy = await this.policyRepository.findOne({ where: { id: updateDto.id } });
    if (!policy) {
      throw new NotFoundException(`Device platform version policy with ID ${updateDto.id} not found`);
    }

    let release = await this.releaseRepo.findOneBy({catalogId: updateDto.catalogId})
    if (!release){
      throw new NotFoundException(`Version with catalogId: ${updateDto.catalogId} not found!`);
    }
    if (release.status != ReleaseStatusEnum.RELEASED){
      throw new ForbiddenException(`Version with catalogId: ${updateDto.catalogId}, is not released!`)
    }
    policy.release = release
    
    policy.platform = updateDto.platformId ? {id: updateDto.platformId} as any : policy.platform;
    policy.deviceType = updateDto.deviceTypeId ? {id: updateDto.deviceTypeId} as any : policy.deviceType; ;
    policy.project = updateDto.platformId ? {id: updateDto.projectId} as any : policy.project;
    policy.release = updateDto.catalogId ? {catalogId: updateDto.catalogId} as any : policy.release; 
    const updatedPolicy = await this.policyRepository.save(policy);
    return this.findOne(updatedPolicy.id);
  }

  async remove(id: number): Promise<string> {
    this.logger.debug(`Removing policy entity with ID: ${id}`);
    const result = await this.policyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Device platform version policy with ID ${id} not found`);
    }
    return "Policy deleted successfully";
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
        release: { catalogId: true },
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
