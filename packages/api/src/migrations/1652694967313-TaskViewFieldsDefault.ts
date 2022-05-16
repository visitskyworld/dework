import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskViewFieldsDefault1652694967313 implements MigrationInterface {
  name = "TaskViewFieldsDefault1652694967313";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" ALTER COLUMN "fields" SET DEFAULT '["status","gating","name","priority","dueDate","skills","tags","assignees","button"]'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" ALTER COLUMN "fields" SET DEFAULT '["status","gating","assignees","name","tags","button","dueDate","priority"]'`
    );
  }
}
