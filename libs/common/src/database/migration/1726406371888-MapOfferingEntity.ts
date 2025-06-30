import { MigrationInterface, QueryRunner } from "typeorm";

export class MapOfferingEntity1726406371888 implements MigrationInterface {
    name = 'MapOfferingEntity1726406371888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."map_offering_action_enum" AS ENUM('offering', 'push')`);
        await queryRunner.query(`CREATE TABLE "map_offering" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "action" "public"."map_offering_action_enum" NOT NULL DEFAULT 'offering', "device_ID" character varying NOT NULL, "map_catalog_id" character varying NOT NULL, CONSTRAINT "map_offering_unique_constraint" UNIQUE ("device_ID", "map_catalog_id"), CONSTRAINT "PK_8524d35a8ec73e6a724c8034520" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."device_map_state_enum" RENAME TO "device_map_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_enum" AS ENUM('offering', 'push', 'import', 'delivery', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" TYPE "public"."device_map_state_enum" USING "state"::"text"::"public"."device_map_state_enum"`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" SET DEFAULT 'import'`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "map_offering" ADD CONSTRAINT "FK_cf5cd54fe06defcddfecd1f156f" FOREIGN KEY ("device_ID") REFERENCES "device"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "map_offering" ADD CONSTRAINT "FK_e829b30276341648fd52a141497" FOREIGN KEY ("map_catalog_id") REFERENCES "map"("catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map_offering" DROP CONSTRAINT "FK_e829b30276341648fd52a141497"`);
        await queryRunner.query(`ALTER TABLE "map_offering" DROP CONSTRAINT "FK_cf5cd54fe06defcddfecd1f156f"`);
        await queryRunner.query(`CREATE TYPE "public"."device_map_state_enum_old" AS ENUM('import', 'delivery', 'installed', 'uninstalled')`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" TYPE "public"."device_map_state_enum_old" USING "state"::"text"::"public"."device_map_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "device_map" ALTER COLUMN "state" SET DEFAULT 'import'`);
        await queryRunner.query(`DROP TYPE "public"."device_map_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."device_map_state_enum_old" RENAME TO "device_map_state_enum"`);
        await queryRunner.query(`DROP TABLE "map_offering"`);
        await queryRunner.query(`DROP TYPE "public"."map_offering_action_enum"`);
    }

}
