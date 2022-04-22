import { MigrationInterface, QueryRunner } from "typeorm";

export class BacklogTaskStatus1650496786319 implements MigrationInterface {
  name = "BacklogTaskStatus1650496786319";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE "task"
        SET "status" = 'COMMUNITY_SUGGESTIONS'
        WHERE "status" = 'BACKLOG'
      `);
    const oldRows: { id: string; options: any }[] = await queryRunner.query(`
      SELECT "id", "options"
      FROM "project"
    `);
    const newRows = oldRows.map((row) => {
      row.options ||= {};
      row.options.showCommunitySuggestions =
        row.options.showBacklogColumn || false;
      row.options.showBacklogColumn = false;
      return row;
    });
    for (const row of newRows) {
      await queryRunner.query(
        `
        UPDATE "project"
        SET "options" = $1
        WHERE "id" = $2
      `,
        [row.options, row.id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE "task"
        SET "status" = 'BACKLOG'
        WHERE "status" = 'COMMUNITY_SUGGESTIONS'
      `);
    const oldRows: { id: string; options: any }[] = await queryRunner.query(`
      SELECT "id", "options"
      FROM "project"
    `);
    const newRows = oldRows.map((row) => {
      row.options ||= {};
      row.options.showBacklogColumn = row.options.showCommunitySuggestions;
      delete row.options.showCommunitySuggestions;
      return row;
    });
    for (const row of newRows) {
      await queryRunner.query(
        `
        UPDATE "project"
        SET "options" = $1
        WHERE "id" = $2
      `,
        [row.options, row.id]
      );
    }
  }
}
