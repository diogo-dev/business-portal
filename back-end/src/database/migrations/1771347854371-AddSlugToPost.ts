import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToPost1771347854371 implements MigrationInterface {
    name = 'AddSlugToPost1771347854371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "UQ_cd1bddce36edc3e766798eab376" UNIQUE ("slug")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cd1bddce36edc3e766798eab37" ON "post" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cd1bddce36edc3e766798eab37"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "UQ_cd1bddce36edc3e766798eab376"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "slug"`);
    }

}
