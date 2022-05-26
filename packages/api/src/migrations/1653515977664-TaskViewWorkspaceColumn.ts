import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskViewWorkspaceColumn1653515977664
  implements MigrationInterface
{
  name = "TaskViewWorkspaceColumn1653515977664";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_view" ADD "workspaceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "task_view" ADD CONSTRAINT "FK_6b22ad22717dc008204ac7cc962" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" DROP CONSTRAINT "FK_6b22ad22717dc008204ac7cc962"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" DROP COLUMN "workspaceId"`
    );
  }
}
