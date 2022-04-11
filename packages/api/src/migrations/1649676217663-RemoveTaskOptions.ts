import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTaskOptions1649676217663 implements MigrationInterface {
  name = "RemoveTaskOptions1649676217663";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "options"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "options" json`);
  }
}
