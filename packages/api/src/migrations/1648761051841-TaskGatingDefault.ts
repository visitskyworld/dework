import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskGatingDefault1648761051841 implements MigrationInterface {
  name = "TaskGatingDefault1648761051841";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_gating_default_type_enum" AS ENUM('APPLICATION', 'ROLES', 'OPEN_SUBMISSION')`
    );
    await queryRunner.query(
      `CREATE TABLE "task_gating_default" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."task_gating_default_type_enum" NOT NULL, "userId" uuid NOT NULL, "projectId" uuid NOT NULL, CONSTRAINT "PK_4ec4c8a6cba34bcaae886ea067c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a4d76553c6d3d757c57a4fb107" ON "task_gating_default" ("userId", "projectId") `
    );
    await queryRunner.query(
      `CREATE TABLE "task_gating_default_role" ("taskGatingDefaultId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_6912dc53179545fbb090f8a6d6b" PRIMARY KEY ("taskGatingDefaultId", "roleId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9c6f5b1bd8156ab3ac832fa6c" ON "task_gating_default_role" ("taskGatingDefaultId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_710d3f5576502358ecd88dc734" ON "task_gating_default_role" ("roleId") `
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default" ADD CONSTRAINT "FK_8606f5d972767f08e72d5b1ded3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default" ADD CONSTRAINT "FK_bf2a3fc303ced1dcaede366f95a" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default_role" ADD CONSTRAINT "FK_c9c6f5b1bd8156ab3ac832fa6ca" FOREIGN KEY ("taskGatingDefaultId") REFERENCES "task_gating_default"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default_role" ADD CONSTRAINT "FK_710d3f5576502358ecd88dc734e" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_gating_default_role" DROP CONSTRAINT "FK_710d3f5576502358ecd88dc734e"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default_role" DROP CONSTRAINT "FK_c9c6f5b1bd8156ab3ac832fa6ca"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default" DROP CONSTRAINT "FK_bf2a3fc303ced1dcaede366f95a"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_gating_default" DROP CONSTRAINT "FK_8606f5d972767f08e72d5b1ded3"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_710d3f5576502358ecd88dc734"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9c6f5b1bd8156ab3ac832fa6c"`
    );
    await queryRunner.query(`DROP TABLE "task_gating_default_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4d76553c6d3d757c57a4fb107"`
    );
    await queryRunner.query(`DROP TABLE "task_gating_default"`);
    await queryRunner.query(
      `DROP TYPE "public"."task_gating_default_type_enum"`
    );
  }
}
