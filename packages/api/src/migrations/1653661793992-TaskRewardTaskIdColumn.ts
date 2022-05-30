import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskRewardTaskIdColumn1653661793992 implements MigrationInterface {
  name = "TaskRewardTaskIdColumn1653661793992";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows: { taskId: string; rewardId: string }[] =
      await queryRunner.query(`
        SELECT "id" AS "taskId", "rewardId" AS "rewardId"
        FROM task
        WHERE "rewardId" IS NOT NULL
      `);

    await queryRunner.query(`ALTER TABLE "task_reward" ADD "taskId" uuid NULL`);
    await queryRunner.query(
      `ALTER TABLE "task_reward" ADD CONSTRAINT "FK_3aaf32e363df9180623ee2cae65" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );

    await queryRunner.query(`
      ${rows
        .map(
          (r) =>
            `UPDATE "task_reward" SET "taskId" = '${r.taskId}' WHERE "id" = '${r.rewardId}';`
        )
        .join("\n")}
    `);

    await queryRunner.query(`DELETE FROM task_reward WHERE "taskId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "task_reward" ALTER COLUMN "taskId" SET NOT NULL`
    );

    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_8107e7b11547115fc03644ff6bd"`
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "UQ_8107e7b11547115fc03644ff6bd"`
    );
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "rewardId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward" DROP CONSTRAINT "FK_3aaf32e363df9180623ee2cae65"`
    );
    await queryRunner.query(`ALTER TABLE "task_reward" DROP COLUMN "taskId"`);
    await queryRunner.query(`ALTER TABLE "task" ADD "rewardId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "UQ_8107e7b11547115fc03644ff6bd" UNIQUE ("rewardId")`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_8107e7b11547115fc03644ff6bd" FOREIGN KEY ("rewardId") REFERENCES "task_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
