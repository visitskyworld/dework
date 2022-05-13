import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectIntegrationCascadeDelete1652437536203
  implements MigrationInterface
{
  name = "ProjectIntegrationCascadeDelete1652437536203";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_integration" DROP CONSTRAINT "FK_3fe2ce05bc36b97afff4eb11fb1"`
    );
    await queryRunner.query(
      `ALTER TABLE "project_integration" ADD CONSTRAINT "FK_3fe2ce05bc36b97afff4eb11fb1" FOREIGN KEY ("organizationIntegrationId") REFERENCES "organization_integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_integration" DROP CONSTRAINT "FK_3fe2ce05bc36b97afff4eb11fb1"`
    );
    await queryRunner.query(
      `ALTER TABLE "project_integration" ADD CONSTRAINT "FK_3fe2ce05bc36b97afff4eb11fb1" FOREIGN KEY ("organizationIntegrationId") REFERENCES "organization_integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
