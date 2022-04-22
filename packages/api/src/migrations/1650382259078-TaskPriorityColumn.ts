import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskPriorityColumn1650382259078 implements MigrationInterface {
  name = "TaskPriorityColumn1650382259078";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_priority_enum" AS ENUM('URGENT', 'HIGH', 'MEDIUM', 'LOW')`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD "priority" "public"."task_priority_enum"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "priority"`);
    await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
  }
}
