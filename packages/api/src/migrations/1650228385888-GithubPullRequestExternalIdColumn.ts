import { MigrationInterface, QueryRunner } from "typeorm";

export class GithubPullRequestExternalIdColumn1650228385888
  implements MigrationInterface
{
  name = "GithubPullRequestExternalIdColumn1650228385888";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "github_pull_request" ADD "externalId" integer`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "github_pull_request" DROP COLUMN "externalId"`
    );
  }
}
