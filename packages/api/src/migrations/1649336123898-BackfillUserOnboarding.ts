import { MigrationInterface, QueryRunner } from "typeorm";

export class BackfillUserOnboarding1649336123898 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersWithoutOnboarding: { id: string }[] = await queryRunner.query(`
      SELECT "user".id
      FROM "user"
      LEFT JOIN user_onboarding ON user_onboarding."userId" = "user".id
      WHERE user_onboarding.id IS NULL
    `);

    await queryRunner.query(`
      INSERT INTO user_onboarding ("type", "userId")
      VALUES ${usersWithoutOnboarding
        .map((user) => `('Onboarding.v1.ExistingUser', '${user.id}')`)
        .join(",\n")};
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
