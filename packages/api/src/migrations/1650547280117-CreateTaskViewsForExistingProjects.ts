import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskViewsForExistingProjects1650547280117
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const projects: { id: string }[] = await queryRunner.query(`
      SELECT project.id
      FROM project
      LEFT JOIN task_view ON task_view."projectId" = project.id
      WHERE task_view.id IS NULL
    `);

    await queryRunner.query(`
      INSERT INTO task_view ("name", "slug", "sortKey", "type", "groupBy", "filters", "sortBys", "projectId")
      VALUES ${projects
        .map(
          (p, i) =>
            `('Board', 'board-${i}', '${Date.now()}', 'BOARD', 'status', CAST('[]' AS json), CAST('[]' AS json), '${
              p.id
            }')`
        )
        .join(",\n")}
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
