import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskGating1649202229181 implements MigrationInterface {
  name = "TaskGating1649202229181";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_gating_enum" AS ENUM('ASSIGNEES', 'APPLICATION', 'ROLES', 'OPEN_SUBMISSION')`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD "gating" "public"."task_gating_enum" NOT NULL DEFAULT 'APPLICATION'`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."task_gating_default_type_enum" RENAME TO "task_gating_default_type_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_gating_default_type_enum" AS ENUM('ASSIGNEES', 'APPLICATION', 'ROLES', 'OPEN_SUBMISSION')`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default" ALTER COLUMN "type" TYPE "public"."task_gating_default_type_enum" USING "type"::"text"::"public"."task_gating_default_type_enum"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."task_gating_default_type_enum_old"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_gating_default_type_enum_old" AS ENUM('APPLICATION', 'ROLES', 'OPEN_SUBMISSION')`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default" ALTER COLUMN "type" TYPE "public"."task_gating_default_type_enum_old" USING "type"::"text"::"public"."task_gating_default_type_enum_old"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."task_gating_default_type_enum"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."task_gating_default_type_enum_old" RENAME TO "task_gating_default_type_enum"`
    );
  }
}
