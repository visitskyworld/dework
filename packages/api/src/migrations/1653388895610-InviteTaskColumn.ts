import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteTaskColumn1653388895610 implements MigrationInterface {
  name = "InviteTaskColumn1653388895610";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invite" ADD "taskId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "invite" ADD CONSTRAINT "FK_ab570df76ce769f4cd9f59c979d" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invite" DROP CONSTRAINT "FK_ab570df76ce769f4cd9f59c979d"`
    );
    await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "taskId"`);
  }
}
