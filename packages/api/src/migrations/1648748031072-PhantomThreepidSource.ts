import { MigrationInterface, QueryRunner } from "typeorm";

export class PhantomThreepidSource1648748031072 implements MigrationInterface {
  name = "PhantomThreepidSource1648748031072";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_unique_threepid_source"`);
    await queryRunner.query(
      `ALTER TYPE "public"."threepid_source_enum" RENAME TO "threepid_source_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."threepid_source_enum" AS ENUM('github', 'discord', 'metamask', 'phantom', 'notion', 'hiro', 'trello')`
    );
    await queryRunner.query(
      `ALTER TABLE "threepid" ALTER COLUMN "source" TYPE "public"."threepid_source_enum" USING "source"::"text"::"public"."threepid_source_enum"`
    );
    await queryRunner.query(`DROP TYPE "public"."threepid_source_enum_old"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_unique_threepid_source" ON "threepid" ("threepid", "source") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."threepid_source_enum_old" AS ENUM('github', 'discord', 'metamask', 'notion', 'hiro', 'trello')`
    );
    await queryRunner.query(
      `ALTER TABLE "threepid" ALTER COLUMN "source" TYPE "public"."threepid_source_enum_old" USING "source"::"text"::"public"."threepid_source_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."threepid_source_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."threepid_source_enum_old" RENAME TO "threepid_source_enum"`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_unique_threepid_source" ON "threepid" ("threepid", "source") `
    );
  }
}
