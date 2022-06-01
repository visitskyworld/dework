import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskApplicationAndSubmissionStatus1654080329969
  implements MigrationInterface
{
  name = "TaskApplicationAndSubmissionStatus1654080329969";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_application_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`
    );
    await queryRunner.query(
      `ALTER TABLE "task_application" ADD "status" "public"."task_application_status_enum" NOT NULL DEFAULT 'PENDING'`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_submission_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`
    );
    await queryRunner.query(
      `ALTER TABLE "task_submission" ADD "status" "public"."task_submission_status_enum" NOT NULL DEFAULT 'PENDING'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_submission" DROP COLUMN "status"`
    );
    await queryRunner.query(`DROP TYPE "public"."task_submission_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "task_application" DROP COLUMN "status"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."task_application_status_enum"`
    );
  }
}
