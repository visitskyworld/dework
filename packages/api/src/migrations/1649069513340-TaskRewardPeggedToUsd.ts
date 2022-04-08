import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskRewardPeggedToUsd1649069513340 implements MigrationInterface {
  name = "TaskRewardPeggedToUsd1649069513340";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward" ADD "peggedToUsd" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward" DROP COLUMN "peggedToUsd"`
    );
  }
}
