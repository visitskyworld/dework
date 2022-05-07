import { MigrationInterface, QueryRunner } from "typeorm";

export class SkillParentColumn1651931478615 implements MigrationInterface {
  name = "SkillParentColumn1651931478615";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "skill" ADD "parentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_e234cee90be3691936e2350b610" FOREIGN KEY ("parentId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_e234cee90be3691936e2350b610"`
    );
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "parentId"`);
  }
}
