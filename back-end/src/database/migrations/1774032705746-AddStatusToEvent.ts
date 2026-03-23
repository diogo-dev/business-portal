import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToEvent1774032705746 implements MigrationInterface {
    name = 'AddStatusToEvent1774032705746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_status_enum" AS ENUM('draft', 'published', 'archived')`);
        await queryRunner.query(`ALTER TABLE "event" ADD "status" "public"."event_status_enum" NOT NULL DEFAULT 'draft'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."event_status_enum"`);
    }

}
