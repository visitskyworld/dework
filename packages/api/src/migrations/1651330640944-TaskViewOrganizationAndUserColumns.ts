import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskViewOrganizationAndUserColumns1651330640944
  implements MigrationInterface
{
  name = "TaskViewOrganizationAndUserColumns1651330640944";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" ALTER COLUMN "projectId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" ADD "organizationId" uuid NULL`
    );
    await queryRunner.query(`ALTER TABLE "task_view" ADD "userId" uuid NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" ALTER COLUMN "projectId" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "task_view" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "task_view" DROP COLUMN "organizationId"`
    );
  }
}
