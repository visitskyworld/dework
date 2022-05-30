import { MigrationInterface, QueryRunner } from "typeorm";

export class TokenImageUrl1653835405205 implements MigrationInterface {
  name = "TokenImageUrl1653835405205";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_token" ADD "imageUrl" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_token" DROP COLUMN "imageUrl"`
    );
  }
}
