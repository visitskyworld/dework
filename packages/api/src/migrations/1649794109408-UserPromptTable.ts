import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPromptTable1649794109408 implements MigrationInterface {
  name = "UserPromptTable1649794109408";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_prompt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "userId" uuid NOT NULL, "completedAt" TIMESTAMP, CONSTRAINT "PK_e8de580c18291d53712839bc23b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_prompt" ADD CONSTRAINT "FK_ce5ff4d4c3b6bbf9f26413f5ccb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_prompt" DROP CONSTRAINT "FK_ce5ff4d4c3b6bbf9f26413f5ccb"`
    );
    await queryRunner.query(`DROP TABLE "user_prompt"`);
  }
}
