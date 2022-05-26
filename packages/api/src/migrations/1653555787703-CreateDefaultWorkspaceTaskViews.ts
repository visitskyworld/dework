import _ from "lodash";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefaultWorkspaceTaskViews1653555787703
  implements MigrationInterface
{
  name = "CreateDefaultWorkspaceTaskViews1653555787703";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const workspaces: { id: string }[] = await queryRunner.query(`
      SELECT workspace.id
      FROM workspace
    `);

    const chunkIndex = 0;
    const chunkSize = 100;
    for (const chunk of _.chunk(workspaces, chunkSize)) {
      const chunkOffset = chunkIndex * chunkSize;
      await queryRunner.query(`
        INSERT INTO "task_view" ("name", "slug", "sortKey", "type", "groupBy", "filters", "sortBys", "workspaceId") VALUES
        ${chunk
          .map(
            (w, i) => `
            ('Board', 'board-w-${
              i + chunkOffset
            }', '${Date.now()}', 'BOARD', 'status', '[]', '[]', '${w.id}'),
            ('Open Tasks', 'open-tasks-w-${
              i + chunkOffset
            }', '${Date.now()}', 'LIST', 'status', '[{"type":"STATUSES","statuses":["TODO"]},{"type":"ASSIGNEES","assigneeIds":[null]}]', '[{"direction":"ASC","field":"priority"}]', '${
              w.id
            }')
          `
          )
          .join(",\n")}
      `);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
