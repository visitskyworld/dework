import { MigrationInterface, QueryRunner } from "typeorm";
import _ from "lodash";

export class SetTaskGatingForEachTask1649249280555
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tasks: { id: string; gating: string }[] = await queryRunner.query(`
      SELECT
        task.id,
        (CASE
          WHEN COUNT(DISTINCT task_assignees."userId") > 0 THEN 'ASSIGNEES'
            WHEN task."options"->>'allowOpenSubmission' = 'true' THEN 'OPEN_SUBMISSION'
            WHEN COUNT(DISTINCT rule."roleId") > 0 THEN 'ROLES'
            ELSE 'APPLICATION'
        END) as gating
      FROM task
      LEFT JOIN task_assignees ON task_assignees."taskId" = task.id
      LEFT JOIN rule ON rule."taskId" = task.id
      GROUP BY task.id
    `);

    const tasksByGating = _.groupBy(tasks, (t) => t.gating);
    for (const gating of Object.keys(tasksByGating)) {
      const taskIds = tasksByGating[gating].map((t) => `'${t.id}'`);
      await queryRunner.query(`
        UPDATE task
        SET gating = '${gating}'
        WHERE id IN (${taskIds.join(", ")})
      `);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
