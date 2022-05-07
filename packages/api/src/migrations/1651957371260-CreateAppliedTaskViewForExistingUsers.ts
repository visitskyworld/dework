import _ from "lodash";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppliedTaskViewForExistingUsers1651957371260
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: { id: string }[] = await queryRunner.query(`
      SELECT "user".id
      FROM "user"
    `);

    let chunkIndex = 0;
    const chunkSize = 100;
    for (const chunk of _.chunk(users, chunkSize)) {
      const chunkOffset = chunkIndex * chunkSize;
      await queryRunner.query(`
        INSERT INTO task_view ("name", "slug", "sortKey", "type", "groupBy", "filters", "sortBys", "userId")
        VALUES ${chunk
          .map(
            (p, i) =>
              `
              ('Applied', 'applied-${
                i + chunkOffset
              }', '${Date.now()}', 'LIST', 'status', CAST('${JSON.stringify([
                { type: "STATUSES", statuses: ["TODO"] },
                { type: "ASSIGNEES", assigneeIds: [null] },
                { type: "APPLICANTS", applicantIds: [p.id] },
              ])}' AS json), CAST('[]' AS json), '${p.id}')
              `
          )
          .join(",\n")}
      `);

      chunkIndex++;
    }
  }

  public async down(): Promise<void> {}
}
