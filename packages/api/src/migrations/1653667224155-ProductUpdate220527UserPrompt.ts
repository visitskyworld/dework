import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductUpdate220527UserPrompt1653667224155
  implements MigrationInterface
{
  private type = "ProductUpdate.220527";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO user_prompt ("type", "userId")
      SELECT '${this.type}', "user"."id"
      FROM "user"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM user_prompt WHERE "type" = '${this.type}'`
    );
  }
}
