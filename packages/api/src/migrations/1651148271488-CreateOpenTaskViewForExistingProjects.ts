import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOpenTaskViewForExistingProjects1651148271488
  implements MigrationInterface
{
  name = "CreateOpenTaskViewForExistingProjects1651148271488";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const projects: { id: string }[] = await queryRunner.query(`
      SELECT project.id
      FROM project
    `);

    await queryRunner.query(`
      INSERT INTO task_view ("name", "slug", "sortKey", "type", "groupBy", "filters", "sortBys", "projectId")
      VALUES ${projects
        .map(
          (p, i) =>
            `(
              'Open Tasks',
              'open-tasks-${i}',
              '${Date.now()}',
              'LIST',
              'status',
              CAST('[
                { "type": "STATUSES", "statuses": ["TODO"] },
                { "type": "ASSIGNEES", "assigneeIds": [null] }
              ]' AS json),
              CAST('[
                { "direction":"ASC", "field":"priority" }
              ]' AS json),
              '${p.id}'
            )`
        )
        .join(",\n")}
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
