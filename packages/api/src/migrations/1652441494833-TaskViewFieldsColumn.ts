import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskViewFieldsColumn1652441494833 implements MigrationInterface {
  name = "TaskViewFieldsColumn1652441494833";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" ADD "fields" json NOT NULL DEFAULT '["status","gating","assignees","name","tags","button","dueDate","priority"]'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_view" DROP COLUMN "fields"`);
  }
}
