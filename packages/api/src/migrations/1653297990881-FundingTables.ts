import { MigrationInterface, QueryRunner } from "typeorm";

export class FundingTables1653297990881 implements MigrationInterface {
  name = "FundingTables1653297990881";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "funding_vote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "weight" integer NOT NULL, "sessionId" uuid NOT NULL, "taskId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_4be81189ecc368d270e3fdfa9f0" UNIQUE ("sessionId", "taskId", "userId"), CONSTRAINT "PK_4b5ed7a14b09e5ddda9f251da6e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "funding_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "tokenId" uuid NOT NULL, "organizationId" uuid NOT NULL, "closedAt" TIMESTAMP, CONSTRAINT "PK_59a40a3b825bfd3632af501d961" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward" ADD "fundingSessionId" uuid`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_vote" ADD CONSTRAINT "FK_8702163984a57c34304ab59be6e" FOREIGN KEY ("sessionId") REFERENCES "funding_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_vote" ADD CONSTRAINT "FK_2e17476234bf6c9f583fac90e27" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_vote" ADD CONSTRAINT "FK_de3ed99cdfb5a0f600d9198e264" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_session" ADD CONSTRAINT "FK_96f0f748a433aaab9538b21838b" FOREIGN KEY ("tokenId") REFERENCES "payment_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_session" ADD CONSTRAINT "FK_103fd90dbba8fe6485d71a9b79a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding_session" DROP CONSTRAINT "FK_103fd90dbba8fe6485d71a9b79a"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_session" DROP CONSTRAINT "FK_96f0f748a433aaab9538b21838b"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_vote" DROP CONSTRAINT "FK_de3ed99cdfb5a0f600d9198e264"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_vote" DROP CONSTRAINT "FK_2e17476234bf6c9f583fac90e27"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_vote" DROP CONSTRAINT "FK_8702163984a57c34304ab59be6e"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_reward" DROP COLUMN "fundingSessionId"`
    );
    await queryRunner.query(`DROP TABLE "funding_session"`);
    await queryRunner.query(`DROP TABLE "funding_vote"`);
  }
}
