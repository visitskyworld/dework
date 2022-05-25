import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTaskRewardTriggerColumn1653297682061
  implements MigrationInterface
{
  name = "RemoveTaskRewardTriggerColumn1653297682061";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_reward" DROP COLUMN "trigger"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward" ADD "trigger" character varying NOT NULL`
    );
  }
}
