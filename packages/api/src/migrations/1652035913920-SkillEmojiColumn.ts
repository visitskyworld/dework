import { MigrationInterface, QueryRunner } from "typeorm";

export class SkillEmojiColumn1652035913920 implements MigrationInterface {
  name = "SkillEmojiColumn1652035913920";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill" ADD "emoji" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD "sortKey" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "emoji"`);
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "sortKey"`);
  }
}
