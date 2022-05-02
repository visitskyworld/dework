import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskStoryPointsColumn1651316334302 implements MigrationInterface {
  name = "TaskStoryPointsColumn1651316334302";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "task"
        ALTER COLUMN "storyPoints" TYPE float4
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "task"
        ALTER COLUMN "storyPoints" TYPE int4
    `);
  }
}
