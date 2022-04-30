import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueGithubBranch1651357372965 implements MigrationInterface {
  name = "UniqueGithubBranch1651357372965";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "github_branch" DROP COLUMN "link"`);
    await queryRunner.query(
      `ALTER TABLE "github_branch" ADD CONSTRAINT "UQ_5d665ae9c702d9915324ccc87da" UNIQUE ("name", "organization", "repo", "taskId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "github_branch" DROP CONSTRAINT "UQ_5d665ae9c702d9915324ccc87da"`
    );
    await queryRunner.query(
      `ALTER TABLE "github_branch" ADD "link" character varying NOT NULL`
    );
  }
}
