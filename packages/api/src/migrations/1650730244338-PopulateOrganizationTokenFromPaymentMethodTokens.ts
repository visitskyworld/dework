import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateOrganizationTokenFromPaymentMethodTokens1650730244338
  implements MigrationInterface
{
  name = "PopulateOrganizationTokenFromPaymentMethodTokens1650730244338";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tokens: { tokenId: string; organizationId: string }[] =
      await queryRunner.query(`
			SELECT organization.id as "organizationId", payment_method_token."paymentTokenId" as "tokenId"
			FROM organization
			INNER JOIN project ON project."organizationId" = organization.id
			INNER JOIN payment_method ON payment_method."projectId" = project.id
			INNER JOIN payment_method_token ON payment_method_token."paymentMethodId" = payment_method.id
			GROUP BY organization.id, payment_method_token."paymentTokenId"
		`);

    await queryRunner.query(`
			INSERT INTO organization_token ("organizationId", "paymentTokenId")
			VALUES ${tokens
        .map((token) => `('${token.organizationId}', '${token.tokenId}')`)
        .join(",\n")}
		`);

    await queryRunner.query(`DROP TABLE "organization_token"`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no going back
  }
}
