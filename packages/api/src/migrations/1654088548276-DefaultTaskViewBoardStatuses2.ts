import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTaskViewBoardStatuses21654088548276
  implements MigrationInterface
{
  name = "DefaultTaskViewBoardStatuses21654088548276";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const statusFilter = {
      type: "STATUSES",
      statuses: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
    };

    const views: { id: string; filters: any[] }[] = await queryRunner.query(`
      SELECT id, filters
      FROM task_view
      WHERE type = 'BOARD'
    `);

    for (const view of views) {
      if (!!view.filters.some((f) => f.type === "STATUSES")) {
        continue;
      }

      view.filters.push(statusFilter);
      await queryRunner.query(`
        UPDATE task_view
        SET filters = CAST('${JSON.stringify(view.filters)}' AS json)
        WHERE "id" = '${view.id}'
      `);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
