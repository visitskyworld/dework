import slugify from "slugify";
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableColumnOptions,
} from "typeorm";
import { Workspace } from "../models/Workspace";
import { slugBlacklist } from "../utils/slugBlacklist";

export class WorkspaceSlugColumn1653234038907 implements MigrationInterface {
  tableName = "workspace";
  columnName = "slug";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnOptions: TableColumnOptions = {
      name: this.columnName,
      type: "varchar",
      isNullable: false,
      isUnique: true,
    };
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({ ...columnOptions, isNullable: true })
    );

    const workspaces = await queryRunner.manager.find(Workspace, {
      withDeleted: true,
    });
    for (const workspace of workspaces) {
      console.log(
        "workspace",
        workspaces.indexOf(workspace),
        "/",
        workspaces.length
      );
      const slug = await this.generateSlug(queryRunner, workspace.name);
      await queryRunner.query(`
        UPDATE workspace
        SET slug = '${slug}'
        WHERE id = '${workspace.id}'
      `);
    }

    await queryRunner.changeColumn(
      this.tableName,
      this.columnName,
      new TableColumn(columnOptions)
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.columnName);
  }

  private async generateSlug(
    queryRunner: QueryRunner,
    name: string
  ): Promise<string> {
    const slug = slugify(name.slice(0, 20), { lower: true, strict: true });
    const matchingSlugs = await queryRunner
      .query(`SELECT slug FROM workspace WHERE slug ~ '^${slug}(-\\d+)?$'`)
      .then((res: { slug: string }[]) => res.map((r) => r.slug));

    if (!matchingSlugs.length && !slugBlacklist.has(slug)) return slug;
    const set = new Set(matchingSlugs);
    for (let i = 1; i < matchingSlugs.length + 2; i++) {
      const candidate = `${slug}-${i}`;
      if (!set.has(candidate)) return candidate;
    }
    throw new Error("Could not generate slug");
  }
}
