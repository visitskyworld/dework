import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskApplicationDiscordThreadUrl1651182368792
  implements MigrationInterface
{
  name = "TaskApplicationDiscordThreadUrl1651182368792";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_application" ADD "discordThreadUrl" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_application" DROP COLUMN "discordThreadUrl"`
    );
  }
}
