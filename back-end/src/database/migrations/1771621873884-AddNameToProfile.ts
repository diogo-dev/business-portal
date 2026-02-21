import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToProfile1771621873884 implements MigrationInterface {
    name = 'AddNameToProfile1771621873884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "last_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "first_name"`);
    }

}
