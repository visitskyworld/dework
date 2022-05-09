import _ from "lodash";
import { MigrationInterface, QueryRunner } from "typeorm";

export class MapTaskTagsToTaskSkills1652042839881
  implements MigrationInterface
{
  private tagsBySkill: Record<string, string[]> = {
    Development: [
      "development",
      "github issue",
      "frontend",
      "bug",
      "🐞 bug",
      "backend",
      "tech-debt",
      "tech debt",
      "api",
      "pr-merged",
      "ios",
      "engineering",
      "front-end",
      "android",
    ],
    Design: ["design", "figma"],
    Translation: [
      "translation",
      "chinese",
      "spanish",
      "portugese",
      "russian",
      "turkish",
      "french",
      "japanese",
    ],
    Writing: ["writing", "blog", "content"],
    Marketing: ["marketing", "twitter", "partnerships"],
    Community: ["community"],
    Product: ["product"],
    Research: ["research"],
    Legal: ["legal"],
    Operations: ["operations", "business development"],
    Admin: ["admin"],
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskTags: { taskId: string; label: string }[] =
      await queryRunner.query(`
        SELECT task.id as "taskId", LOWER(task_tag.label) as "label"
        FROM task
        INNER JOIN task_tag_map ON task_tag_map."taskId" = task.id
        INNER JOIN task_tag ON task_tag.id = task_tag_map."taskTagId"
      `);

    const skills: { id: string; name: string }[] = await queryRunner.query(`
      SELECT id, name FROM skill
    `);

    for (const skill of skills) {
      const tags = this.tagsBySkill[skill.name];
      console.log(skill, tags);

      const taskIds = _.uniq(
        taskTags
          .filter((taskTag) => tags.includes(taskTag.label))
          .map((taskTag) => taskTag.taskId)
      );

      if (!!taskIds.length) {
        await queryRunner.query(`
          INSERT INTO task_skill ("taskId", "skillId")
          VALUES ${taskIds
            .map((taskId) => `('${taskId}', '${skill.id}')`)
            .join(",\n")};
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM task_skill");
  }
}
