import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferingTreePolicyEntity } from '@app/common/database/entities/offering-tree-policy.entity';
import { CreateOfferingTreePolicyDto, OfferingTreePolicyDto, OfferingTreePolicyParams, UpdateOfferingTreePolicyDto } from '@app/common/dto/offering';

@Injectable()
export class OfferingTreePolicyService {

  private readonly logger = new Logger(OfferingTreePolicyService.name);

  constructor(
    @InjectRepository(OfferingTreePolicyEntity)
    private readonly policyRepository: Repository<OfferingTreePolicyEntity>,
  ) {}

  async create(createDto: CreateOfferingTreePolicyDto): Promise<OfferingTreePolicyDto> {
    const policy = this.policyRepository.create();
    policy.platform = {id: createDto.platformId} as any;
    policy.deviceType = {id: createDto.deviceTypeId} as any ;
    policy.project = {id: createDto.projectId} as any;
    policy.release = {catalogId: createDto.catalogId} as any; 

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
}
