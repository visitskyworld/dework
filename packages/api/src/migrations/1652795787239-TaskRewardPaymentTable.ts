import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskRewardPaymentTable1652795787239 implements MigrationInterface {
  name = "TaskRewardPaymentTable1652795787239";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_reward_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" character varying NOT NULL, "tokenId" uuid NOT NULL, "paymentId" uuid NOT NULL, "userId" uuid NOT NULL, "rewardId" uuid NOT NULL, CONSTRAINT "PK_4f47b1a544234d8099410e7816d" PRIMARY KEY ("id"))`
    );

    const rows: {
      taskId: string;
      rewardId: string;
      paymentId: string;
      amount: string;
      tokenId: string;
      userId: string;
    }[] = await queryRunner.query(`
      SELECT
        DISTINCT task.id AS "taskId",
        task_reward.id AS "rewardId",
        payment.id AS "paymentId",
        task_reward.amount AS "amount",
        task_reward."tokenId" AS "tokenId",
        task_assignees."userId" AS "userId"
      FROM task_reward
      INNER JOIN payment ON payment.id = task_reward."paymentId"
      INNER JOIN task ON task."rewardId" = task_reward.id
      INNER JOIN task_assignees ON task_assignees."taskId" = task.id
    `);

    if (rows.length) {
      // This isn't 100% accurate since peggedToUsd bounties would have the unconverted amount here
      await queryRunner.query(`
        INSERT INTO "task_reward_payment" ("rewardId", "paymentId", "amount", "tokenId", "userId")
        VALUES ${rows
          .map(
            (r) =>
              `('${r.rewardId}', '${r.paymentId}', '${r.amount}', '${r.tokenId}', '${r.userId}')`
          )
          .join(",\n")}
  
      `);
    }

    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" ADD CONSTRAINT "FK_93232fe99a983fbd1424f3add98" FOREIGN KEY ("tokenId") REFERENCES "payment_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" ADD CONSTRAINT "FK_f88cfca2707022661fe45339554" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" ADD CONSTRAINT "FK_ba0d0bb58dbe00bf8f0669ddea4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" ADD CONSTRAINT "FK_e5cf4b8de73f579dbcb302fd032" FOREIGN KEY ("rewardId") REFERENCES "task_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE "task_reward" DROP CONSTRAINT "FK_3c8ee6d2ae04c504d54f60ffb5a"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward" DROP COLUMN "paymentId"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" DROP CONSTRAINT "FK_e5cf4b8de73f579dbcb302fd032"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" DROP CONSTRAINT "FK_ba0d0bb58dbe00bf8f0669ddea4"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" DROP CONSTRAINT "FK_f88cfca2707022661fe45339554"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward_payment" DROP CONSTRAINT "FK_93232fe99a983fbd1424f3add98"`
    );
    await queryRunner.query(`ALTER TABLE "task_reward" ADD "paymentId" uuid`);
    await queryRunner.query(`DROP TABLE "task_reward_payment"`);
    await queryRunner.query(
      `ALTER TABLE "task_reward" ADD CONSTRAINT "FK_3c8ee6d2ae04c504d54f60ffb5a" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
