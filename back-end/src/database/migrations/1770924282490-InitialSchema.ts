
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770924282490 implements MigrationInterface {
    name = 'InitialSchema1770924282490';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(50) NOT NULL,
            "description" character varying(255),
            "resource" character varying(20),
            "action" character varying(20),
            CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"),
            CONSTRAINT "CHK_bf9fb87f7e6bab3b3eba728344" CHECK ("action" IN ('create', 'read', 'update', 'delete', 'comment')),
            CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "event" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "title" character varying NOT NULL,
            "description" text NOT NULL,
            "location" character varying NOT NULL,
            "cover_image_url" character varying,
            "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "creatorId" uuid,
            CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "post_comment" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "content" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "authorId" uuid,
            "postId" uuid,
            CONSTRAINT "REL_a8a5a8cd757122e162e86d78d3" UNIQUE ("authorId"),
            CONSTRAINT "PK_5a0d63e41c3c55e11319613550c" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "category" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "slug" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TYPE "public"."post_status_enum" AS ENUM('draft', 'published', 'archived')`);
        await queryRunner.query(`CREATE TABLE "post" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "title" character varying NOT NULL,
            "content" character varying NOT NULL,
            "summary" character varying,
            "status" "public"."post_status_enum" NOT NULL DEFAULT 'draft',
            "cover_image_url" character varying,
            "published_at" TIMESTAMP WITH TIME ZONE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "authorId" uuid,
            CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TYPE "public"."profile_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "profile" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "age" integer NOT NULL,
            "date_of_birth" date NOT NULL,
            "bio" character varying NOT NULL,
            "avatar_url" character varying NOT NULL,
            "phone" character varying NOT NULL,
            "postal_code" character varying NOT NULL,
            "city" character varying NOT NULL,
            "state" character varying NOT NULL,
            "country" character varying NOT NULL,
            "social_links" text NOT NULL,
            "gender" "public"."profile_gender_enum" NOT NULL,
            "occupation" character varying NOT NULL,
            CONSTRAINT "UQ_abc0939a17fd68fcd10d1095224" UNIQUE ("phone"),
            CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "user_account" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "password_hash" character varying NOT NULL,
            "user_name" character varying NOT NULL,
            "profile_id" uuid,
            CONSTRAINT "UQ_56a0e4bcec2b5411beafa47ffa5" UNIQUE ("email"),
            CONSTRAINT "REL_9b95c118e196f2b10ce08cf859" UNIQUE ("profile_id"),
            CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "role" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(50) NOT NULL,
            "description" character varying(255),
            CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"),
            CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "post_categories" (
            "post_id" uuid NOT NULL,
            "category_id" uuid NOT NULL,
            CONSTRAINT "PK_4d9e522c51f13c52ad35813cf35" PRIMARY KEY ("post_id", "category_id")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_becbe37977577e3eeb089b69fe" ON "post_categories" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f6e2655c798334198182db6399" ON "post_categories" ("category_id") `);
        await queryRunner.query(`CREATE TABLE "user_roles" (
            "userAccountId" uuid NOT NULL,
            "roleId" uuid NOT NULL,
            CONSTRAINT "PK_047a5b7fd4c94dfd7ef608eae99" PRIMARY KEY ("userAccountId", "roleId")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_2eaacf5cbf2a6d06bc0f02263f" ON "user_roles" ("userAccountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "role_permissions" (
            "roleId" uuid NOT NULL,
            "permissionId" uuid NOT NULL,
            CONSTRAINT "PK_d430a02aad006d8a70f3acd7d03" PRIMARY KEY ("roleId", "permissionId")
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_b4599f8b8f548d35850afa2d12" ON "role_permissions" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_06792d0c62ce6b0203c03643cd" ON "role_permissions" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41" FOREIGN KEY ("creatorId") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39" FOREIGN KEY ("authorId") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD CONSTRAINT "FK_9b95c118e196f2b10ce08cf859a" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_categories" ADD CONSTRAINT "FK_becbe37977577e3eeb089b69fe1" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_categories" ADD CONSTRAINT "FK_f6e2655c798334198182db6399b" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_2eaacf5cbf2a6d06bc0f02263fd" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_2eaacf5cbf2a6d06bc0f02263fd"`);
        await queryRunner.query(`ALTER TABLE "post_categories" DROP CONSTRAINT "FK_f6e2655c798334198182db6399b"`);
        await queryRunner.query(`ALTER TABLE "post_categories" DROP CONSTRAINT "FK_becbe37977577e3eeb089b69fe1"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP CONSTRAINT "FK_9b95c118e196f2b10ce08cf859a"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672"`);
        await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "FK_a8a5a8cd757122e162e86d78d39"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06792d0c62ce6b0203c03643cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4599f8b8f548d35850afa2d12"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86033897c009fcca8b6505d6be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2eaacf5cbf2a6d06bc0f02263f"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6e2655c798334198182db6399"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_becbe37977577e3eeb089b69fe"`);
        await queryRunner.query(`DROP TABLE "post_categories"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user_account"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "public"."profile_gender_enum"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "post_comment"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }
}
