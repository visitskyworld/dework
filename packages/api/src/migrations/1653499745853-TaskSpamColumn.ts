import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskSpamColumn1653499745853 implements MigrationInterface {
  name = "TaskSpamColumn1653499745853";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" ADD "spam" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "spam"`);
  }
}
