import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskViewTable1650496133431 implements MigrationInterface {
  name = "TaskViewTable1650496133431";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_view_type_enum" AS ENUM('LIST', 'BOARD')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_view_groupby_enum" AS ENUM('status')`
    );
    await queryRunner.query(
      `CREATE TABLE "task_view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "sortKey" character varying NOT NULL, "type" "public"."task_view_type_enum" NOT NULL, "groupBy" "public"."task_view_groupby_enum" NOT NULL DEFAULT 'status', "filters" json NOT NULL, "sortBys" json NOT NULL DEFAULT '[{"field":"sortKey","direction":"ASC"}]', "projectId" uuid NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_f4c3a51cd56250a117c9bbb3af6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" ADD CONSTRAINT "FK_1e5e43bbd58c370c538dac0b17c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" DROP CONSTRAINT "FK_1e5e43bbd58c370c538dac0b17c"`
    );
    await queryRunner.query(`DROP TABLE "task_view"`);
    await queryRunner.query(`DROP TYPE "public"."task_view_groupby_enum"`);
    await queryRunner.query(`DROP TYPE "public"."task_view_type_enum"`);
  }
}
