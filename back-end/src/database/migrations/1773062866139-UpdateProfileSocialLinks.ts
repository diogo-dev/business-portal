import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProfileSocialLinks1773062866139 implements MigrationInterface {
    name = 'UpdateProfileSocialLinks1773062866139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "age" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "date_of_birth" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "social_links"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "social_links" json`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "gender" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "gender" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "social_links"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "social_links" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "date_of_birth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "age" SET NOT NULL`);
    }

}
