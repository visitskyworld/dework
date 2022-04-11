import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProjectVisibility1649676511413
  implements MigrationInterface
{
  name = "RemoveProjectVisibility1649676511413";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "visibility"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "visibility" character varying NOT NULL DEFAULT 'PUBLIC'`
    );
  }
}
