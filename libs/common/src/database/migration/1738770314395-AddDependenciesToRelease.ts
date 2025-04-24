import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDependenciesToRelease1738770314395 implements MigrationInterface {
    name = 'AddDependenciesToRelease1738770314395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "release_dependencies" ("release_id" character varying NOT NULL, "dependency_release_id" character varying NOT NULL, CONSTRAINT "PK_000ee7d550aec28dd171ca06248" PRIMARY KEY ("release_id", "dependency_release_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_806fcca9e0acbb41d617ab01b5" ON "release_dependencies" ("release_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b30a8e4539cb3878aef8daa670" ON "release_dependencies" ("dependency_release_id") `);
        await queryRunner.query(`ALTER TABLE "release_dependencies" ADD CONSTRAINT "FK_806fcca9e0acbb41d617ab01b5a" FOREIGN KEY ("release_id") REFERENCES "release"("catalog_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "release_dependencies" ADD CONSTRAINT "FK_b30a8e4539cb3878aef8daa670e" FOREIGN KEY ("dependency_release_id") REFERENCES "release"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_dependencies" DROP CONSTRAINT "FK_b30a8e4539cb3878aef8daa670e"`);
        await queryRunner.query(`ALTER TABLE "release_dependencies" DROP CONSTRAINT "FK_806fcca9e0acbb41d617ab01b5a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b30a8e4539cb3878aef8daa670"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_806fcca9e0acbb41d617ab01b5"`);
        await queryRunner.query(`DROP TABLE "release_dependencies"`);
    }

}
