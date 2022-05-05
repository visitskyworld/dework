import _ from "lodash";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskViewsForExistingUsers1651489743993
  implements MigrationInterface
{
  name = "CreateTaskViewsForExistingUsers1651489743993";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: { id: string }[] = await queryRunner.query(`
      SELECT "user".id
      FROM "user"
    `);

    for (const chunk of _.chunk(users, 100)) {
      await queryRunner.query(`
        INSERT INTO task_view ("name", "slug", "sortKey", "type", "groupBy", "filters", "sortBys", "userId")
        VALUES ${chunk
          .map(
            (p, i) =>
              `
                  ('Assigned', 'assigned-${i}', '${Date.now()}', 'BOARD', 'status', CAST('[ { "type": "ASSIGNEES", "assigneeIds": ["${
                p.id
              }"] } ]' AS json), CAST('[]' AS json), '${p.id}'),
                  ('To Review', 'to-review-${i}', '${Date.now()}', 'BOARD', 'status', CAST('[ { "type": "OWNERS", "ownerIds": ["${
                p.id
              }"] } ]' AS json), CAST('[]' AS json), '${p.id}')
              `
          )
          .join(",\n")}
      `);

      // ('Applied', 'applied-${i}', '${Date.now()}', 'LIST', 'status', CAST('[ { "type": "STATUSES", "statuses": ["TODO"] }, { "type": "ASSIGNEES", "assigneeIds": [null] } ]' AS json), CAST('[]' AS json), '${
      //           p.id
      //         }'),
    }
  }

  public async down(): Promise<void> {}
}
