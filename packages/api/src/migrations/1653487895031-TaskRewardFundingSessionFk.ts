import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskRewardFundingSessionFk1653487895031
  implements MigrationInterface
{
  name = "TaskRewardFundingSessionFk1653487895031";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward" ADD CONSTRAINT "FK_b2e926e66a2542d926116da701d" FOREIGN KEY ("fundingSessionId") REFERENCES "funding_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward" DROP CONSTRAINT "FK_b2e926e66a2542d926116da701d"`
    );
  }
}
