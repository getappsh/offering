import { Injectable, NotFoundException, BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RuleEntity } from '../../database/entities/rule.entity';
import { RuleReleaseEntity } from '../../database/entities/rule-release.entity';
import { RuleDeviceTypeEntity } from '../../database/entities/rule-device-type.entity';
import { RuleDeviceEntity } from '../../database/entities/rule-device.entity';
import { RuleOsEntity } from '../../database/entities/rule-os.entity';
import { ReleaseEntity } from '../../database/entities/release.entity';
import { DeviceTypeEntity } from '../../database/entities/device-type.entity';
import { DeviceEntity } from '../../database/entities/device.entity';
import { CreateRuleDto, CreatePolicyDto, CreateRestrictionDto, UpdateRuleDto } from '../dto';
import { RuleValidationService } from './rule-validation.service';
import { RuleType } from '../enums/rule.enums';
import { RuleDefinition } from '../types/rule.types';
import { DEFAULT_ALLOW_ALL_DEVICES_RULE_ID, DEFAULT_ALLOW_ALL_DEVICES_RULE_NAME, DEFAULT_ALLOW_ALL_DEVICES_RULE } from '../constants';

interface RuleQueryFilter {
  type?: RuleType;
  isActive?: boolean;
  releaseId?: string;
  deviceTypeId?: number;
  deviceTypeName?: string;
  deviceId?: string;
  osType?: string;
  projectIdentifier?: string | number;
}

interface RuleQueryFilter {
  type?: RuleType;
  isActive?: boolean;
  releaseId?: string;
  deviceTypeId?: number;
  deviceTypeName?: string;
  deviceId?: string;
  osType?: string;
  projectIdentifier?: string | number;
}

@Injectable()
export class RuleService implements OnModuleInit {
  private readonly logger = new Logger(RuleService.name);
  constructor(
    @InjectRepository(RuleEntity)
    private readonly ruleRepository: Repository<RuleEntity>,
    @InjectRepository(RuleReleaseEntity)
    private readonly ruleReleaseRepository: Repository<RuleReleaseEntity>,
    @InjectRepository(RuleDeviceTypeEntity)
    private readonly ruleDeviceTypeRepository: Repository<RuleDeviceTypeEntity>,
    @InjectRepository(RuleDeviceEntity)
    private readonly ruleDeviceRepository: Repository<RuleDeviceEntity>,
    @InjectRepository(RuleOsEntity)
    private readonly ruleOsRepository: Repository<RuleOsEntity>,
    @InjectRepository(ReleaseEntity)
    private readonly releaseRepository: Repository<ReleaseEntity>,
    @InjectRepository(DeviceTypeEntity)
    private readonly deviceTypeRepository: Repository<DeviceTypeEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly ruleValidationService: RuleValidationService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ruleRepository.createQueryBuilder()
      .insert()
      .into(RuleEntity)
      .values({
        id: DEFAULT_ALLOW_ALL_DEVICES_RULE_ID,
        name: DEFAULT_ALLOW_ALL_DEVICES_RULE_NAME,
        description: 'Default policy that allows all devices to download a component. This rule is automatically applied to all existing and new releases unless manually removed.',
        type: RuleType.POLICY,
        version: 1,
        isActive: true,
        rule: DEFAULT_ALLOW_ALL_DEVICES_RULE,
      })
      .orUpdate(['rule'], ['id'])
      .execute();

    this.logger.log('Default "Allow All Devices" rule seeded');
  }

  /**
   * Creates a new rule with its associations
   */
  async createRule(createRuleDto: CreateRuleDto): Promise<RuleEntity> {
    // Validate the rule
    await this.ruleValidationService.validateRule(createRuleDto.rule);

    // Validate associations based on rule type
    if (createRuleDto.type === RuleType.POLICY) {
      if (!createRuleDto.association.releases || createRuleDto.association.releases.length === 0) {
        throw new BadRequestException('Policies must be associated with at least one release');
      }
    } else if (createRuleDto.type === RuleType.RESTRICTION) {
      const hasAssociation = 
        (createRuleDto.association.deviceTypeNames && createRuleDto.association.deviceTypeNames.length > 0) ||
        (createRuleDto.association.deviceIds && createRuleDto.association.deviceIds.length > 0) ||
        (createRuleDto.association.osTypes && createRuleDto.association.osTypes.length > 0);
      
      if (!hasAssociation) {
        throw new BadRequestException(
          'Restrictions must be associated with at least one device type, device, or OS',
        );
      }
    }

    // Create the rule
    const rule = this.ruleRepository.create({
      name: createRuleDto.name,
      description: createRuleDto.description,
      type: createRuleDto.type,
      rule: createRuleDto.rule,
      isActive: createRuleDto.isActive ?? true,
      isPush: createRuleDto.isPush ?? false,
      version: 1,
    });

    const savedRule = await this.ruleRepository.save(rule);

    // Create associations
    await this.createAssociations(savedRule, createRuleDto.association);

    // Return the rule with associations loaded
    return this.findOneById(savedRule.id);
  }

  /**
   * Updates an existing rule
   */
  async updateRule(id: string, updateRuleDto: UpdateRuleDto): Promise<RuleEntity> {
    const rule = await this.findOneById(id);

    // If the rule object is being updated, validate it
    if (updateRuleDto.rule) {
      await this.ruleValidationService.validateRule(updateRuleDto.rule);
      rule.version += 1; // Auto-increment version
    }

    // Update basic fields
    if (updateRuleDto.name !== undefined) rule.name = updateRuleDto.name;
    if (updateRuleDto.description !== undefined) rule.description = updateRuleDto.description;
    if (updateRuleDto.isActive !== undefined) rule.isActive = updateRuleDto.isActive;
    if (updateRuleDto.isPush !== undefined) rule.isPush = updateRuleDto.isPush;
    if (updateRuleDto.rule !== undefined) rule.rule = updateRuleDto.rule;

    await this.ruleRepository.save(rule);

    // Update associations if provided
    if (updateRuleDto.association) {
      await this.updateAssociations(rule, updateRuleDto.association);
    }

    return this.findOneById(id);
  }

  /**
   * Deletes a rule
   */
  async deleteRule(id: string): Promise<{ success: boolean; message: string }> {
    const rule = await this.findOneById(id);
    await this.ruleRepository.remove(rule);
    return { success: true, message: 'Rule deleted successfully' };
  }

  /**
   * Finds a rule by ID with all associations
   */
  async findOneById(id: string): Promise<RuleEntity> {
    const rule = await this.ruleRepository.findOne({
      where: { id },
      relations: [
        'releaseAssociations',
        'releaseAssociations.release',
        'releaseAssociations.release.project',
        'deviceTypeAssociations',
        'deviceTypeAssociations.deviceType',
        'deviceAssociations',
        'deviceAssociations.device',
        'osAssociations',
      ],
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID "${id}" not found`);
    }

    return rule;
  }

  /**
   * Finds all rules with optional filters
   */
  async findAll(query: RuleQueryFilter, projectIds?: number[]): Promise<RuleEntity[]> {
    const queryBuilder = this.ruleRepository
      .createQueryBuilder('rule')
      .leftJoinAndSelect('rule.releaseAssociations', 'releaseAssoc')
      .leftJoinAndSelect('releaseAssoc.release', 'release')
      .leftJoinAndSelect('release.project', 'project')
      .leftJoinAndSelect('rule.deviceTypeAssociations', 'deviceTypeAssoc')
      .leftJoinAndSelect('deviceTypeAssoc.deviceType', 'deviceType')
      .leftJoinAndSelect('rule.deviceAssociations', 'deviceAssoc')
      .leftJoinAndSelect('deviceAssoc.device', 'device')
      .leftJoinAndSelect('rule.osAssociations', 'osAssoc');

    if (query.type) {
      queryBuilder.andWhere('rule.type = :type', { type: query.type });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('rule.isActive = :isActive', { isActive: query.isActive });
    }

    // Filter by project IDs if provided (for policies)
    if (projectIds && projectIds.length > 0 && query.type === RuleType.POLICY) {
      queryBuilder.andWhere('project.id IN (:...projectIds)', { projectIds });
    }

    if (query.releaseId) {
      queryBuilder.andWhere('release.catalogId = :releaseId', { releaseId: query.releaseId });
    }

    if (query.deviceTypeId) {
      queryBuilder.andWhere('deviceType.id = :deviceTypeId', { deviceTypeId: query.deviceTypeId });
    }

    if (query.deviceId) {
      queryBuilder.andWhere('device.ID = :deviceId', { deviceId: query.deviceId });
    }

    if (query.osType) {
      queryBuilder.andWhere('osAssoc.osType = :osType', { osType: query.osType });
    }

    queryBuilder.orderBy('rule.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Converts a RuleEntity to RuleDefinition format
   */
  ruleEntityToDefinition(rule: RuleEntity): RuleDefinition {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      type: rule.type,
      version: rule.version,
      isActive: rule.isActive,
      isPush: rule.isPush ?? false,
      rule: rule.rule,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
      association: {
        releases: rule.releaseAssociations?.map(ra => ({
          projectId: ra.release?.project?.id?.toString(),
          projectName: ra.release?.project?.name,
          version: ra.release?.version,
        })) || [],
        deviceTypeNames: rule.deviceTypeAssociations?.map(dta => dta.deviceType?.name) || [],
        deviceIds: rule.deviceAssociations?.map(da => da.device?.ID) || [],
        osTypes: rule.osAssociations?.map(oa => oa.osType) || [],
      },
    };
  }

  /**
   * Creates associations for a rule
   */
  private async createAssociations(rule: RuleEntity, association: any): Promise<void> {
    // Release associations (for policies)
    if (association.releases && association.releases.length > 0) {
      const uniqueReleaseMap = new Map<string, any>();
      for (const release of association.releases) {
        const projectKey = release.projectId && typeof release.projectId === 'string' && release.projectId.trim() !== ''
          ? `projectId:${release.projectId.trim()}`
          : `projectName:${release.projectName}`;
        const versionKey = release.version ?? '';
        uniqueReleaseMap.set(`${projectKey}|version:${versionKey}`, release);
      }
      const uniqueReleases = Array.from(uniqueReleaseMap.values());
      this.logger.debug(`Creating associations for ${uniqueReleases.length} unique release(s)`);
      
      // Build where conditions - prefer projectId over projectName
      const whereConditions = uniqueReleases.map(r => {
        // Check if projectId is provided and is a non-empty string
        if (r.projectId && typeof r.projectId === 'string' && r.projectId.trim() !== '') {
          // Use projectId if provided (preferred since names can change)
          this.logger.debug(`Using projectId: ${r.projectId}, version: ${r.version}`);
          return {
            project: { id: parseInt(r.projectId, 10) },
            version: r.version,
          };
        } else if (r.projectName) {
          // Fall back to projectName if projectId not provided or empty
          this.logger.debug(`Using projectName: ${r.projectName}, version: ${r.version}`);
          return {
            project: { name: r.projectName },
            version: r.version,
          };
        } else {
          throw new BadRequestException('Either projectId or projectName must be provided for release identification');
        }
      });

      const releases = await this.releaseRepository.find({
        where: whereConditions,
        relations: ['project'],
      });

      this.logger.debug(`Found ${releases.length} release(s) in database`);

      if (releases.length !== uniqueReleases.length) {
        const requestedReleases = uniqueReleases.map(r => 
          r.projectId ? `projectId=${r.projectId}, version=${r.version}` : `projectName=${r.projectName}, version=${r.version}`
        );
        const foundReleases = releases.map(r => 
          `projectId=${r.project?.id}, projectName=${r.project?.name}, version=${r.version}`
        );
        this.logger.error(`Requested releases: ${JSON.stringify(requestedReleases)}`);
        this.logger.error(`Found releases: ${JSON.stringify(foundReleases)}`);
        throw new BadRequestException(`One or more releases not found. Requested: ${uniqueReleases.length}, Found: ${releases.length}`);
      }

      const ruleReleases = releases.map(release =>
        this.ruleReleaseRepository.create({ rule, release }),
      );
      await this.ruleReleaseRepository.save(ruleReleases);
    }

    // Device type associations (for restrictions)
    if (association.deviceTypeNames && association.deviceTypeNames.length > 0) {
      const uniqueDeviceTypeNames = [...new Set(association.deviceTypeNames)];
      this.logger.debug(`Creating associations for ${uniqueDeviceTypeNames.length} unique device type(s)`);
      
      const deviceTypes = await this.deviceTypeRepository.find({
        where: { name: In(uniqueDeviceTypeNames) },
      });

      if (deviceTypes.length !== uniqueDeviceTypeNames.length) {
        throw new BadRequestException('One or more device types not found');
      }

      const ruleDeviceTypes = deviceTypes.map(deviceType =>
        this.ruleDeviceTypeRepository.create({ rule, deviceType }),
      );
      await this.ruleDeviceTypeRepository.save(ruleDeviceTypes);
    }

    // Device associations (for restrictions)
    if (association.deviceIds && association.deviceIds.length > 0) {
      const uniqueDeviceIds = [...new Set(association.deviceIds)];
      this.logger.debug(`Creating associations for ${uniqueDeviceIds.length} unique device(s)`);
      
      const devices = await this.deviceRepository.find({
        where: { ID: In(uniqueDeviceIds) },
      });

      if (devices.length !== uniqueDeviceIds.length) {
        throw new BadRequestException('One or more devices not found');
      }

      const ruleDevices = devices.map(device =>
        this.ruleDeviceRepository.create({ rule, device }),
      );
      await this.ruleDeviceRepository.save(ruleDevices);
    }

    // OS associations (for restrictions)
    if (association.osTypes && association.osTypes.length > 0) {
      const uniqueOsTypes = [...new Set(association.osTypes as string[])] as string[];
      this.logger.debug(`Creating associations for ${uniqueOsTypes.length} unique OS type(s)`);
      
      const ruleOsList = uniqueOsTypes.map((osType: string) =>
        this.ruleOsRepository.create({ rule, osType }),
      );
      await this.ruleOsRepository.save(ruleOsList);
    }
  }

  /**
   * Updates associations for a rule
   */
  private async updateAssociations(rule: RuleEntity, association: any): Promise<void> {
    // Remove existing associations
    await this.ruleReleaseRepository.delete({ rule: { id: rule.id } });
    await this.ruleDeviceTypeRepository.delete({ rule: { id: rule.id } });
    await this.ruleDeviceRepository.delete({ rule: { id: rule.id } });
    await this.ruleOsRepository.delete({ rule: { id: rule.id } });

    // Create new associations
    await this.createAssociations(rule, association);
  }
}
