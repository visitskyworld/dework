import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskRewardFeaturedColumn1652105512246
  implements MigrationInterface
{
  name = "TaskRewardFeaturedColumn1652105512246";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" ADD "featured" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "featured"`);
  }
}
