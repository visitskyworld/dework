import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTaskViewBoardStatuses1654018648603
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const filters = [
      {
        type: "STATUSES",
        statuses: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
      },
    ];
    await queryRunner.query(`
      UPDATE task_view
      SET filters = CAST('${JSON.stringify(filters)}' AS json)
      WHERE "type" = 'BOARD'
        AND "filters"::text = '[]'
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
