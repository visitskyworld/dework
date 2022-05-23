import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceCleanup1653296998461 implements MigrationInterface {
  name = "WorkspaceCleanup1653296998461";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspace" DROP CONSTRAINT "FK_9ec7141326608b74a917172b1cc"`
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_4a829b528874ab55fc9cbaee7ff"`
    );
    await queryRunner.query(
      `ALTER TABLE "workspace" ADD CONSTRAINT "FK_a700527eb11f812d79f55907d33" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_c224ab17df530651e53a398ed92" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_c224ab17df530651e53a398ed92"`
    );
    await queryRunner.query(
      `ALTER TABLE "workspace" DROP CONSTRAINT "FK_a700527eb11f812d79f55907d33"`
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_4a829b528874ab55fc9cbaee7ff" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "workspace" ADD CONSTRAINT "FK_9ec7141326608b74a917172b1cc" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
