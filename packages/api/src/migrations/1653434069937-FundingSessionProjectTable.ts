import { MigrationInterface, QueryRunner } from "typeorm";

export class FundingSessionProjectTable1653434069937
  implements MigrationInterface
{
  name = "FundingSessionProjectTable1653434069937";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "funding_session_project" ("fundingSessionId" uuid NOT NULL, "projectId" uuid NOT NULL, CONSTRAINT "PK_8941390b4f4238b405061e9bce4" PRIMARY KEY ("fundingSessionId", "projectId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2873585cfa5316cce12afad9c6" ON "funding_session_project" ("fundingSessionId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4f021781cce0ac7500fcfbfb0" ON "funding_session_project" ("projectId") `
    );
    await queryRunner.query(`ALTER TABLE "rule" ADD "fundingSessionId" uuid`);
    await queryRunner.query(
      `ALTER TYPE "public"."rule_permission_enum" RENAME TO "rule_permission_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_permission_enum" AS ENUM('MANAGE_ORGANIZATION', 'MANAGE_PROJECTS', 'MANAGE_TASKS', 'MANAGE_FUNDING', 'VIEW_PROJECTS')`
    );
    await queryRunner.query(
      `ALTER TABLE "rule" ALTER COLUMN "permission" TYPE "public"."rule_permission_enum" USING "permission"::"text"::"public"."rule_permission_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."rule_permission_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."invite_permission_enum" RENAME TO "invite_permission_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invite_permission_enum" AS ENUM('MANAGE_ORGANIZATION', 'MANAGE_PROJECTS', 'MANAGE_TASKS', 'MANAGE_FUNDING', 'VIEW_PROJECTS')`
    );
    await queryRunner.query(
      `ALTER TABLE "invite" ALTER COLUMN "permission" TYPE "public"."invite_permission_enum" USING "permission"::"text"::"public"."invite_permission_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."invite_permission_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "rule" ADD CONSTRAINT "FK_c672dbbdfd18ea3269d48946617" FOREIGN KEY ("fundingSessionId") REFERENCES "funding_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_session_project" ADD CONSTRAINT "FK_2873585cfa5316cce12afad9c6d" FOREIGN KEY ("fundingSessionId") REFERENCES "funding_session"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_session_project" ADD CONSTRAINT "FK_f4f021781cce0ac7500fcfbfb0e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funding_session_project" DROP CONSTRAINT "FK_f4f021781cce0ac7500fcfbfb0e"`
    );
    await queryRunner.query(
      `ALTER TABLE "funding_session_project" DROP CONSTRAINT "FK_2873585cfa5316cce12afad9c6d"`
    );
    await queryRunner.query(
      `ALTER TABLE "rule" DROP CONSTRAINT "FK_c672dbbdfd18ea3269d48946617"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invite_permission_enum_old" AS ENUM('MANAGE_ORGANIZATION', 'MANAGE_PROJECTS', 'MANAGE_TASKS', 'VIEW_PROJECTS')`
    );
    await queryRunner.query(
      `ALTER TABLE "invite" ALTER COLUMN "permission" TYPE "public"."invite_permission_enum_old" USING "permission"::"text"::"public"."invite_permission_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."invite_permission_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."invite_permission_enum_old" RENAME TO "invite_permission_enum"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_permission_enum_old" AS ENUM('MANAGE_ORGANIZATION', 'MANAGE_PROJECTS', 'MANAGE_TASKS', 'VIEW_PROJECTS')`
    );
    await queryRunner.query(
      `ALTER TABLE "rule" ALTER COLUMN "permission" TYPE "public"."rule_permission_enum_old" USING "permission"::"text"::"public"."rule_permission_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."rule_permission_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rule_permission_enum_old" RENAME TO "rule_permission_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "rule" DROP COLUMN "fundingSessionId"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f4f021781cce0ac7500fcfbfb0"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2873585cfa5316cce12afad9c6"`
    );
    await queryRunner.query(`DROP TABLE "funding_session_project"`);
  }
}
