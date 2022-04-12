import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveUserOnboardingToUserPrompt1649795569429
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows: {
      createdAt: Date;
      type: string;
      userId: string;
      completedAt: Date | null;
    }[] = await queryRunner.query(`
      SELECT "createdAt", "type", "userId", "completedAt"
      FROM user_onboarding
      WHERE "type" IN (
        'Onboarding.v1.ConnectWallet',
        'Onboarding.v1.ConnectDiscord'
      )
    `);

    await queryRunner.query(`
      INSERT INTO user_prompt ("createdAt", "type", "userId", "completedAt")
      VALUES ${rows
        .map(
          (row) =>
            `('${row.createdAt.toISOString()}', '${row.type}', '${
              row.userId
            }', ${
              row.completedAt ? `'${row.completedAt.toISOString()}'` : "NULL"
            })`
        )
        .join(", ")}
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
