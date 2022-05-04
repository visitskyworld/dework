import { MigrationInterface, QueryRunner } from "typeorm";

export class GithubIssueLinkColumn1651592421500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "github_issue" ADD "link" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE "github_issue" DROP COLUMN "link"`);
  }
}
