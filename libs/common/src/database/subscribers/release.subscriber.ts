import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import * as semver from 'semver';
import { ProjectEntity, ReleaseEntity } from '../entities';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class ReleaseSubscriber implements EntitySubscriberInterface<ReleaseEntity> {
  private readonly logger = new Logger(ReleaseSubscriber.name);

  listenTo() {
    return ReleaseEntity;
  }

  async beforeInsert(event: InsertEvent<ReleaseEntity>){
    this.logger.verbose(`Before insert release for project: ${event.entity.project.id}, version: ${event.entity.version}`);
    const release = event.entity;

    // Fetch project name from database using the project ID
    const projectRepo = event.manager.getRepository(ProjectEntity);
    const project = await projectRepo.findOne({ where: { id: release.project.id }});

    release.catalogId = `${release.project.id}.${project.name}@${release.version}`;  
  }
  async afterInsert(event: InsertEvent<ReleaseEntity>) {
    this.logger.verbose(`After insert release for project: ${event.entity.project.id}, version: ${event.entity.version}`);

    const release = event.entity;

    if (!semver.valid(release.version)) {
      this.logger.warn(`Invalid SemVer: ${release.version}`);
      return;
    }

    const releaseRepo = event.manager.getRepository(ReleaseEntity);

    // Get all releases for the same project, sorted by version
    const releases = await releaseRepo.find({
      select: ['version', 'sortOrder'],
      where: { project: {id: release.project.id} },
      order: { sortOrder: 'ASC' },
    });

    // Ensure all releases are valid SemVer versions
    const semverReleases = releases.filter(r => semver.valid(r.version));
    semverReleases.sort((a, b) => semver.compare(a.version, b.version)); // Sort by version

    const currentIndex = semverReleases.findIndex(r => r.version === release.version);
    const newSortOrder = currentIndex > 0 ? semverReleases[currentIndex - 1].sortOrder + 1 : 1;

    this.logger.verbose(`New sort order: ${newSortOrder}`);

    // Shift existing releases forward if needed
    await releaseRepo
      .createQueryBuilder()
      .update(ReleaseEntity)
      .set({ sortOrder: () => '"sort_order" + 1' }) // Increment all existing sortOrder values
      .where('"sort_order" >= :newSortOrder', { newSortOrder })
      .execute();

    // Set the new release's sort order
    release.sortOrder = newSortOrder;
    await releaseRepo.save(release);
  }
}
