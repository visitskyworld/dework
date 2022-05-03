import { MigrationInterface, QueryRunner } from "typeorm";

export class BackfillOrganizationToken1651539415735
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows: { organizationId: string; tokenId: string }[] =
      await queryRunner.query(`
      SELECT
        payment_token.id AS "tokenId",
        organization.id AS "organizationId"
      FROM task
      INNER JOIN task_reward ON task_reward.id = task."rewardId"
      INNER JOIN payment_token ON payment_token.id = task_reward."tokenId"
      INNER JOIN project ON project.id = task."projectId"
      INNER JOIN organization ON organization.id = project."organizationId"
      LEFT JOIN organization_token ON
        organization_token."organizationId" = organization.id AND
        organization_token."paymentTokenId" = payment_token.id
      WHERE organization_token."organizationId" IS NULL
      GROUP BY payment_token.id, organization.id
    `);

    await queryRunner.query(`
      INSERT INTO organization_token ("organizationId", "paymentTokenId")
      VALUES ${rows
        .map((p) => `('${p.organizationId}', '${p.tokenId}')`)
        .join(",\n")}
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
