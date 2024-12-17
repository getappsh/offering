import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceMapStateEntity1703154137096 implements MigrationInterface {
    name = 'AddDeviceMapStateEntity1703154137096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_4b78115c58fadb87995b90840c5"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_b82e4a49e78c4d2c9125039609d"`);
        await queryRunner.query(`DROP TABLE "device_map"`);
        
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_state_enum" AS ENUM('import', 'delivery', 'installed', 'uninstalled')`);
        await queryRunner.query(`CREATE TABLE "device_map" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now(), "state" "public"."device_map_state_state_enum" NOT NULL DEFAULT 'import', "device_ID" character varying NOT NULL, "map_catalog_id" character varying NOT NULL, CONSTRAINT "device_map_unique_constraint" UNIQUE ("device_ID", "map_catalog_id"), CONSTRAINT "PK_02473e35264dfd5a3027a5e4e19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_b22a81b93cb5ef546234515886c" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_3c49ab81b3b5b0f728d3a668c80" FOREIGN KEY ("map_catalog_id") REFERENCES "map"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_3c49ab81b3b5b0f728d3a668c80"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT "FK_b22a81b93cb5ef546234515886c"`);
        await queryRunner.query(`DROP TABLE "device_map"`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_state_enum"`);
        
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "device_map" ("device_ID" character varying NOT NULL, "map_catalog_id" character varying NOT NULL, CONSTRAINT "PK_2568630761a5f9f48724ebfc9dd" PRIMARY KEY ("device_ID", "map_catalog_id"))`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_b82e4a49e78c4d2c9125039609" ON "device_map" ("device_ID") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS"IDX_4b78115c58fadb87995b90840c" ON "device_map" ("map_catalog_id") `);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT IF EXISTS  "FK_4b78115c58fadb87995b90840c5"`);
        await queryRunner.query(`ALTER TABLE "device_map" DROP CONSTRAINT IF EXISTS  "FK_b82e4a49e78c4d2c9125039609d"`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_b82e4a49e78c4d2c9125039609d" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_map" ADD CONSTRAINT "FK_4b78115c58fadb87995b90840c5" FOREIGN KEY ("map_catalog_id") REFERENCES "map"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
