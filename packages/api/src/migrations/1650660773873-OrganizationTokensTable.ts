import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationTokensTable1650660773873
  implements MigrationInterface
{
  name = "OrganizationTokensTable1650660773873";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_token" ("organizationId" uuid NOT NULL, "paymentTokenId" uuid NOT NULL, CONSTRAINT "PK_ddce39e53748b5e940de80e2482" PRIMARY KEY ("organizationId", "paymentTokenId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8eb4967136eb978cfda1a5600e" ON "organization_token" ("organizationId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b14c83dc674f7d51aa9f4552a" ON "organization_token" ("paymentTokenId") `
    );
    await queryRunner.query(
      `ALTER TABLE "organization_token" ADD CONSTRAINT "FK_8eb4967136eb978cfda1a5600ef" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_token" ADD CONSTRAINT "FK_7b14c83dc674f7d51aa9f4552a2" FOREIGN KEY ("paymentTokenId") REFERENCES "payment_token"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_token" DROP CONSTRAINT "FK_7b14c83dc674f7d51aa9f4552a2"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization_token" DROP CONSTRAINT "FK_8eb4967136eb978cfda1a5600ef"`
    );
    await queryRunner.query(`DROP TABLE "organization_token"`);
  }
}
