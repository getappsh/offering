import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSortOrderToRelease1739183340367 implements MigrationInterface {
    name = 'AddSortOrderToRelease1739183340367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" ADD "sort_order" integer NOT NULL DEFAULT '0'`);

        try{

            // Get all existing releases grouped by project
            const releases = await queryRunner.query(`
                SELECT "catalog_id", "version", "project_id" FROM "release";
            `);
    
            // Group releases by project_id
            const semver = require("semver");
            const releasesByProject: Record<string, any[]> = {};
        
            releases.forEach(release => {
                if (!releasesByProject[release.project_id]) {
                releasesByProject[release.project_id] = [];
                }
                releasesByProject[release.project_id].push(release);
            });
        
            // Process each project's releases
            for (const projectId in releasesByProject) {
                const projectReleases = releasesByProject[projectId];
        
                // Sort by semantic versioning
                projectReleases.sort((a, b) => semver.compare(a.version, b.version));
        
                // Update sort_order sequentially per project
                for (let i = 0; i < projectReleases.length; i++) {
                await queryRunner.query(`
                    UPDATE "release" SET "sort_order" = $1 WHERE "catalog_id" = $2;
                `, [i + 1, projectReleases[i].catalog_id]); // Start sort_order from 1
                }
            }
        }catch (error) {
            console.warn('Error processing releases sort-order:', error);
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release" DROP COLUMN "sort_order"`);
    }

}
