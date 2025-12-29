import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1766542075730 implements MigrationInterface {
    name = 'FirstMigration1766542075730'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        `);

        await queryRunner.query(`
            CREATE TABLE "event" (
                "id" uuid DEFAULT gen_random_uuid(),
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "location" character varying NOT NULL,
                "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "creatorId" uuid,
                CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
            );
        `);
        await queryRunner.query(`
            CREATE TABLE "post_comment" (
                "id" uuid DEFAULT gen_random_uuid(),
                "content" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "authorId" uuid,
                "postId" uuid,
                CONSTRAINT "REL_a8a5a8cd757122e162e86d78d3" UNIQUE ("authorId"),
                CONSTRAINT "PK_5a0d63e41c3c55e11319613550c" PRIMARY KEY ("id")
            );
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."post_status_enum" AS ENUM('draft', 'published', 'archived');
        `);
        await queryRunner.query(`
            CREATE TABLE "post" (
                "id" uuid DEFAULT gen_random_uuid(),
                "title" character varying NOT NULL,
                "content" character varying NOT NULL,
                "summary" character varying,
                "status" "public"."post_status_enum" NOT NULL DEFAULT 'draft',
                "published_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "authorId" uuid,
                CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
            );
        `);
        await queryRunner.query(`
            CREATE TABLE "user_account" (
                "id" uuid DEFAULT gen_random_uuid(),
                "email" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "phone" integer NOT NULL,
                "user_name" character varying NOT NULL,
                CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id")
            );
        `);
        await queryRunner.query(`
            ALTER TABLE "event"
            ADD CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41"
            FOREIGN KEY ("creatorId") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        `);
        await queryRunner.query(`
            ALTER TABLE "post_comment"
            ADD CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39"
            FOREIGN KEY ("authorId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);
        await queryRunner.query(`
            ALTER TABLE "post_comment"
            ADD CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672"
            FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"
            FOREIGN KEY ("authorId") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0";
        `);
        await queryRunner.query(`
            ALTER TABLE "post_comment" DROP CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672";
        `);
        await queryRunner.query(`
            ALTER TABLE "post_comment" DROP CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39";
        `);
        await queryRunner.query(`
            ALTER TABLE "event" DROP CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41";
        `);
        await queryRunner.query(`
            DROP TABLE "user_account";
        `);
        await queryRunner.query(`
            DROP TABLE "post";
        `);
        await queryRunner.query(`
            DROP TYPE "public"."post_status_enum";
        `);
        await queryRunner.query(`
            DROP TABLE "post_comment";
        `);
        await queryRunner.query(`
            DROP TABLE "event";
        `);
    }

}
