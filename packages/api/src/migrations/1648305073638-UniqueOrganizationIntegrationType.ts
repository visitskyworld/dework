import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueOrganizationIntegrationType1648305073638
  implements MigrationInterface
{
  name = "UniqueOrganizationIntegrationType1648305073638";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ADD CONSTRAINT "UQ_566c95b7d5decef87459b971c11" UNIQUE ("type", "organizationId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_integration" DROP CONSTRAINT "UQ_566c95b7d5decef87459b971c11"`
    );
  }
}
