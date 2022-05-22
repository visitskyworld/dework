import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameProjectSectionToWorkspace1653228464331
  implements MigrationInterface
{
  name = "RenameProjectSectionToWorkspace1653228464331";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE project_section RENAME TO workspace`);
    await queryRunner.query(
      `ALTER TABLE project RENAME COLUMN "sectionId" TO "workspaceId"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE workspace RENAME TO project_section`);
    await queryRunner.query(
      `ALTER TABLE project RENAME COLUMN "workspaceId" TO "sectionId"`
    );
  }
}
