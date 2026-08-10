import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730000000000 implements MigrationInterface {
  name = 'InitialSchema1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'USER');
      CREATE TYPE "technology_difficulty_enum" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
      CREATE TYPE "technology_category_enum" AS ENUM ('FUNDAMENTALS', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATABASE', 'TOOLING');
      CREATE TYPE "resource_type_enum" AS ENUM ('video', 'article', 'documentation', 'book', 'course');
      CREATE TYPE "progress_status_enum" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'READY_FOR_ASSESSMENT', 'VALIDATED');
      CREATE TYPE "project_status_enum" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'FINISHED');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "learning_paths" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text NOT NULL,
        CONSTRAINT "UQ_learning_paths_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_learning_paths" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "technologies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "why_learn" text NOT NULL,
        "when_learn" text NOT NULL,
        "estimated_time" integer NOT NULL,
        "difficulty" "technology_difficulty_enum" NOT NULL,
        "order" integer NOT NULL DEFAULT 0,
        "category" "technology_category_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_technologies_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_technologies" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token_hash" character varying(255) NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "revoked_at" TIMESTAMPTZ,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "user_id" uuid NOT NULL,
        "learning_path_id" uuid,
        "total_xp" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_user_profiles" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_user_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_profiles_learning_path" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_streaks" (
        "user_id" uuid NOT NULL,
        "current_streak" integer NOT NULL DEFAULT 0,
        "longest_streak" integer NOT NULL DEFAULT 0,
        "last_activity_date" date,
        CONSTRAINT "PK_user_streaks" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_user_streaks_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "technology_dependencies" (
        "technology_id" uuid NOT NULL,
        "prerequisite_technology_id" uuid NOT NULL,
        CONSTRAINT "PK_technology_dependencies" PRIMARY KEY ("technology_id", "prerequisite_technology_id"),
        CONSTRAINT "FK_tech_dep_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tech_dep_prerequisite" FOREIGN KEY ("prerequisite_technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "resources" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "technology_id" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        "type" "resource_type_enum" NOT NULL,
        "url" character varying(2048) NOT NULL,
        CONSTRAINT "PK_resources" PRIMARY KEY ("id"),
        CONSTRAINT "FK_resources_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "project_suggestions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "technology_id" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "difficulty" "technology_difficulty_enum" NOT NULL,
        CONSTRAINT "PK_project_suggestions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_project_suggestions_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "competencies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "technology_id" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        CONSTRAINT "PK_competencies" PRIMARY KEY ("id"),
        CONSTRAINT "FK_competencies_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "learning_path_technologies" (
        "learning_path_id" uuid NOT NULL,
        "technology_id" uuid NOT NULL,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_learning_path_technologies" PRIMARY KEY ("learning_path_id", "technology_id"),
        CONSTRAINT "FK_lpt_learning_path" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_lpt_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_technology_progress" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "technology_id" uuid NOT NULL,
        "status" "progress_status_enum" NOT NULL DEFAULT 'NOT_STARTED',
        "score" integer,
        "completed_at" TIMESTAMPTZ,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_tech_progress" UNIQUE ("user_id", "technology_id"),
        CONSTRAINT "PK_user_technology_progress" PRIMARY KEY ("id"),
        CONSTRAINT "FK_utp_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_utp_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "project_id" uuid NOT NULL,
        "status" "project_status_enum" NOT NULL DEFAULT 'NOT_STARTED',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_projects" UNIQUE ("user_id", "project_id"),
        CONSTRAINT "PK_user_projects" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_projects_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_projects_project" FOREIGN KEY ("project_id") REFERENCES "project_suggestions"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "assessments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "technology_id" uuid NOT NULL,
        "score" integer NOT NULL,
        "feedback" text NOT NULL,
        "mastered_competencies" jsonb NOT NULL DEFAULT '[]',
        "weak_competencies" jsonb NOT NULL DEFAULT '[]',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_assessments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_assessments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_assessments_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
      );
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "assessments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_projects"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_technology_progress"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "learning_path_technologies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "competencies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project_suggestions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "resources"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "technology_dependencies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_streaks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "technologies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "learning_paths"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "project_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "progress_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "resource_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "technology_category_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "technology_difficulty_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}
