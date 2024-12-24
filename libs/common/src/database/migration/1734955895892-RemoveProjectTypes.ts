import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProjectTypes1734955895892 implements MigrationInterface {
    name = 'RemoveProjectTypes1734955895892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "operation_system"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "formation"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33d8d8c8c7d26b9bee28d78332"`);
        await queryRunner.query(`DROP TABLE "version_packages"`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {   
        await queryRunner.query(`CREATE TABLE "version_packages" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "OS" "public"."version_packages_os_enum" NOT NULL, "formation" "public"."version_packages_formation_enum" NOT NULL, "from_version" character varying NOT NULL, "to_version" character varying NOT NULL, "status" "public"."version_packages_status_enum" NOT NULL DEFAULT 'inProgress', "utl" character varying, CONSTRAINT "PK_eaedcfcdf341f839e321c2e376c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_33d8d8c8c7d26b9bee28d78332" ON "version_packages" ("OS", "formation", "from_version", "to_version") `);
        await queryRunner.query(`CREATE TABLE "platform" ("name" character varying NOT NULL, CONSTRAINT "PK_b9b57ec16b9c2ac927aa62b8b3f" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "formation" ("name" character varying NOT NULL, CONSTRAINT "PK_311c9c94be443daeaeb5fd56444" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "category" ("name" character varying NOT NULL, CONSTRAINT "PK_23c05c292c439d77b0de816b500" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "operation_system" ("name" character varying NOT NULL, CONSTRAINT "PK_616a1c9efbc76d361773ecb2f65" PRIMARY KEY ("name"))`);
   }

}
