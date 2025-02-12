import { ProjectEntity, ProjectType, ReleaseEntity, ReleaseStatusEnum } from "@app/common/database/entities";
import { DeviceComponentsOfferingV2Dto, ComponentOfferingRequestDto } from "@app/common/dto/offering";
import { ComponentV2Dto } from "@app/common/dto/upload";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";


@Injectable()
export class OfferingV2Service {
  private readonly logger = new Logger(OfferingV2Service.name);

  constructor(
    @InjectRepository(ReleaseEntity)private readonly releaseRepo: Repository<ReleaseEntity>,
    @InjectRepository(ProjectEntity)private readonly projectRepo: Repository<ProjectEntity>,    
  ){}

  // TODO push is not implemented
  async getDeviceComponentOffering(dto: ComponentOfferingRequestDto){
    this.logger.log(`Get offering for device: ${dto.deviceId}`);

    // const [updates, offering] = await Promise.all([
    //   this.getUpdatesForComponents(dto),
    //   this.getOfferingFromFormationsAndPlatforms(dto)
    // ])
    // const uniqueOffering = offering.filter(o => !updates.some(u => u.catalogId == o.catalogId))
    // const res = [...uniqueOffering, ...updates].filter(r => !dto.products.includes(r.catalogId));
    

    const offering = await this.getOfferingFromFormationsAndPlatforms(dto)

    const res = new DeviceComponentsOfferingV2Dto()
    res.offer = offering
      .filter(o => !dto.components?.includes(o.catalogId))
      .map(o => ComponentV2Dto.fromEntity(o)); 

    return res
  }

  private async getOfferingFromFormationsAndPlatforms(dto: ComponentOfferingRequestDto){
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

  // Return the latest release for each component id
  private async getUpdatesForComponents(dto: ComponentOfferingRequestDto){
    this.logger.debug(`Get updates for releaseIds: ${dto.components}`);
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
                .where("r.catalog_id IN (:...releaseIds)", { releaseIds: dto.components })
                .getQuery();
              return `re.project_id IN (${subQuery})`;
            })
            .andWhere("re.status = :status", { status: ReleaseStatusEnum.RELEASED })
            .groupBy("re.project_id"),
        "latest",
        "r.project_id = latest.project_id AND r.sort_order = latest.max_sort_order"
      )
      .getMany()

      return updates.filter(r => !dto.components.includes(r.catalogId))
  }

}
