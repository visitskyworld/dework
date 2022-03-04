import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectSortKey1644100021281 implements MigrationInterface {
  tableName = "project";
  columnName = "sortKey";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // const columnOptions: TableColumnOptions = {
    //   name: this.columnName,
    //   type: "varchar",
    //   isNullable: false,
    // };
    // await queryRunner.addColumn(
    //   this.tableName,
    //   new TableColumn({ ...columnOptions, isNullable: true })
    // );
    // await queryRunner.query(`
    //   UPDATE "project"
    //   SET "sortKey" = ROUND(EXTRACT(epoch FROM "createdAt"))::varchar
    // `);
    // await queryRunner.changeColumn(
    //   this.tableName,
    //   this.columnName,
    //   new TableColumn(columnOptions)
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn(this.tableName, this.columnName);
  }
}
