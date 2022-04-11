import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOldTables1649676748047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE organization_member`);
    await queryRunner.query(`DROP TABLE organization_user`);
    await queryRunner.query(`DROP TABLE organization_users`);
    await queryRunner.query(`DROP TABLE project_member`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
