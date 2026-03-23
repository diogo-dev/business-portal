import { MigrationInterface, QueryRunner } from "typeorm";

export class EventContentNull1774022146012 implements MigrationInterface {
    name = 'EventContentNull1774022146012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "content" SET NOT NULL`);
    }

}
