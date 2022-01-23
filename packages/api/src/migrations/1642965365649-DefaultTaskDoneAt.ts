import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTaskDoneAt1642965365649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "task"
      SET "doneAt" = "updatedAt"
      WHERE "status" = 'DONE'
        AND "doneAt" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
