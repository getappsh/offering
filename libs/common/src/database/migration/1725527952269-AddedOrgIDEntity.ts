import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOrgIDEntity1725527952269 implements MigrationInterface {
    name = 'AddedOrgIDEntity1725527952269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_291b4f16ea2616c63998ca2bf4d"`);
        await queryRunner.query(`CREATE TABLE "org_groups" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "parent_id" integer, CONSTRAINT "UQ_e2d15d38ab2601600d249cd8c86" UNIQUE ("name"), CONSTRAINT "PK_65d86191832faf421f09086f170" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "org_uid" ("id" SERIAL NOT NULL, "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UID" integer NOT NULL, "group_id" integer, "device_id" character varying, CONSTRAINT "UQ_019b1de195bc3cb1bc017c82178" UNIQUE ("UID"), CONSTRAINT "REL_3357d672e71ba393beced48a1b" UNIQUE ("device_id"), CONSTRAINT "PK_5ad3f0e5f7ce64e22b8b309efeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "groupsId"`);
        await queryRunner.query(`ALTER TABLE "device_config" ALTER COLUMN "data" SET DEFAULT '{}'::json`);
        await queryRunner.query(`ALTER TABLE "org_groups" ADD CONSTRAINT "FK_95fe022be507bbc5b7416ca7825" FOREIGN KEY ("parent_id") REFERENCES "org_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "org_uid" ADD CONSTRAINT "FK_5cb86ac5292a034fd2c1f793b8b" FOREIGN KEY ("group_id") REFERENCES "org_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "org_uid" ADD CONSTRAINT "FK_3357d672e71ba393beced48a1bc" FOREIGN KEY ("device_id") REFERENCES "device"("ID") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "org_uid" DROP CONSTRAINT "FK_3357d672e71ba393beced48a1bc"`);
        await queryRunner.query(`ALTER TABLE "org_uid" DROP CONSTRAINT "FK_5cb86ac5292a034fd2c1f793b8b"`);
        await queryRunner.query(`ALTER TABLE "org_groups" DROP CONSTRAINT "FK_95fe022be507bbc5b7416ca7825"`);
        await queryRunner.query(`ALTER TABLE "device_config" ALTER COLUMN "data" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "device" ADD "groupsId" integer`);
        await queryRunner.query(`DROP TABLE "org_uid"`);
        await queryRunner.query(`DROP TABLE "org_groups"`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_291b4f16ea2616c63998ca2bf4d" FOREIGN KEY ("groupsId") REFERENCES "devices_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
