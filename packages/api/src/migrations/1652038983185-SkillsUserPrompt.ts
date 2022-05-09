import { MigrationInterface, QueryRunner } from "typeorm";

export class SkillsUserPrompt1652038983185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: { id: string }[] = await queryRunner.query(`
      SELECT "user".id
      FROM "user"
    `);

    await queryRunner.query(`
      INSERT INTO user_prompt ("type", "userId")
      VALUES ${users
        .map((user) => `('Skills.v1.ChooseSkills', '${user.id}')`)
        .join(",\n")};
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
