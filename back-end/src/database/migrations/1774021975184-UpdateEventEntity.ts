import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventEntity1774021975184 implements MigrationInterface {
    name = 'UpdateEventEntity1774021975184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "summary" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "content" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "description" text NOT NULL`);
    }

}
