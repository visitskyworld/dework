import { MigrationInterface, QueryRunner } from "typeorm";

export class CoordinapeOrganizationIntegrationType1648672468694
  implements MigrationInterface
{
  name = "CoordinapeOrganizationIntegrationType1648672468694";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_integration" DROP CONSTRAINT "UQ_566c95b7d5decef87459b971c11"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_integration_type_enum" RENAME TO "organization_integration_type_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_integration_type_enum" AS ENUM('DISCORD', 'GITHUB', 'COORDINAPE')`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ALTER COLUMN "type" TYPE "public"."organization_integration_type_enum" USING "type"::"text"::"public"."organization_integration_type_enum"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_integration_type_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ALTER COLUMN "config" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ADD CONSTRAINT "UQ_566c95b7d5decef87459b971c11" UNIQUE ("type", "organizationId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_integration" DROP CONSTRAINT "UQ_566c95b7d5decef87459b971c11"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ALTER COLUMN "config" SET NOT NULL`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."organization_integration_type_enum_old" AS ENUM('DISCORD', 'GITHUB')`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ALTER COLUMN "type" TYPE "public"."organization_integration_type_enum_old" USING "type"::"text"::"public"."organization_integration_type_enum_old"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."organization_integration_type_enum"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."organization_integration_type_enum_old" RENAME TO "organization_integration_type_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integration" ADD CONSTRAINT "UQ_566c95b7d5decef87459b971c11" UNIQUE ("organizationId", "type")`
    );
  }
}
