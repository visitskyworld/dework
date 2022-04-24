import { MigrationInterface, QueryRunner } from "typeorm";

export class TypeormQueryCacheTable1650827692422 implements MigrationInterface {
  name = "TypeormQueryCacheTable1650827692422";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS typeorm_query_cache_id_seq;`
    );
    await queryRunner.query(`
      CREATE TABLE "public"."typeorm_query_cache" (
          "id" int4 NOT NULL DEFAULT nextval('typeorm_query_cache_id_seq'::regclass),
          "identifier" varchar,
          "time" int8 NOT NULL,
          "duration" int4 NOT NULL,
          "query" text NOT NULL,
          "result" text NOT NULL,
          PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."typeorm_query_cache";`);
  }
}
