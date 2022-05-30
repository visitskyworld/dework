import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableNotificationTaskId1653908392729
  implements MigrationInterface
{
  name = "NullableNotificationTaskId1653908392729";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_704ad601e8d5ec67b5e7ec26e09"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "taskId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_704ad601e8d5ec67b5e7ec26e09" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_704ad601e8d5ec67b5e7ec26e09"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "taskId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_704ad601e8d5ec67b5e7ec26e09" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
