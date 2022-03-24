import slugify from "slugify";
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableColumnOptions,
} from "typeorm";
import { Organization } from "../models/Organization";
import { slugBlacklist } from "../utils/slugBlacklist";

export class GenerateOrgSlugs1647525228036 implements MigrationInterface {
  tableName = "organization";
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

    const organizations = await queryRunner.manager.find(Organization);
    for (const organization of organizations) {
      console.log(
        "organization",
        organizations.indexOf(organization),
        "/",
        organizations.length
      );
      const slug = await this.generateSlug(queryRunner, organization.name);
      await queryRunner.query(`
        UPDATE organization
        SET slug = '${slug}'
        WHERE id = '${organization.id}'
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
      .query(
        `
          SELECT slug
          FROM organization
          WHERE slug ~ '^${slug}(-\\d+)?$'
        `
      )
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
