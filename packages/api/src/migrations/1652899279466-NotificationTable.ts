import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTable1652899279466 implements MigrationInterface {
  name = "NotificationTable1652899279466";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying NOT NULL, "userId" uuid NOT NULL, "taskId" uuid NOT NULL, "archivedAt" TIMESTAMP, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notification_read_marker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "readAt" TIMESTAMP NOT NULL, CONSTRAINT "REL_5d818d072cfe50c19d5e17fa9d" UNIQUE ("userId"), CONSTRAINT "PK_d0ba8b7f3571334a24306886fb6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_704ad601e8d5ec67b5e7ec26e09" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification_read_marker" ADD CONSTRAINT "FK_5d818d072cfe50c19d5e17fa9de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_read_marker" DROP CONSTRAINT "FK_5d818d072cfe50c19d5e17fa9de"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_704ad601e8d5ec67b5e7ec26e09"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`
    );
    await queryRunner.query(`DROP TABLE "notification_read_marker"`);
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}
