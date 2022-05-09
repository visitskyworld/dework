import _ from "lodash";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefaultOrganizationTaskViews1651916505018
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const organizations: { id: string }[] = await queryRunner.query(`
      SELECT organization.id
      FROM organization
    `);

    const chunkIndex = 0;
    const chunkSize = 100;
    for (const chunk of _.chunk(organizations, chunkSize)) {
      const chunkOffset = chunkIndex * chunkSize;
      await queryRunner.query(`
        INSERT INTO "task_view" ("name", "slug", "sortKey", "type", "groupBy", "filters", "sortBys", "organizationId") VALUES
        ${chunk
          .map(
            (org, i) => `
            ('Board', 'board-${
              10000 + i + chunkOffset
            }', '${Date.now()}', 'BOARD', 'status', '[]', '[]', '${org.id}'),
            ('Open Tasks', 'open-tasks-${
              10000 + i + chunkOffset
            }', '${Date.now()}', 'LIST', 'status', '[{"type":"STATUSES","statuses":["TODO"]},{"type":"ASSIGNEES","assigneeIds":[null]}]', '[{"direction":"ASC","field":"priority"}]', '${
              org.id
            }')
          `
          )
          .join(",\n")}
    `);
    }
  }

  public async down(): Promise<void> {}
}
