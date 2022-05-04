import { MigrationInterface, QueryRunner } from "typeorm";

export class SkillTable1651671389801 implements MigrationInterface {
  name = "SkillTable1651671389801";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_skill" ("skillId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_ad35af7f2b556d0b9a67af8db8b" PRIMARY KEY ("skillId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49db81d31fc330a905af3c0120" ON "user_skill" ("skillId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_03260daf2df95f4492cc8eb00e" ON "user_skill" ("userId") `
    );
    await queryRunner.query(
      `CREATE TABLE "task_skill" ("skillId" uuid NOT NULL, "taskId" uuid NOT NULL, CONSTRAINT "PK_dcbc2d06b395ba08e293d63e934" PRIMARY KEY ("skillId", "taskId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51f5774f33b409416b1352eae1" ON "task_skill" ("skillId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5178a92f7069a25c4281032856" ON "task_skill" ("taskId") `
    );
    await queryRunner.query(
      `ALTER TABLE "user_skill" ADD CONSTRAINT "FK_49db81d31fc330a905af3c01205" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_skill" ADD CONSTRAINT "FK_03260daf2df95f4492cc8eb00e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task_skill" ADD CONSTRAINT "FK_51f5774f33b409416b1352eae10" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task_skill" ADD CONSTRAINT "FK_5178a92f7069a25c42810328561" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_skill" DROP CONSTRAINT "FK_5178a92f7069a25c42810328561"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_skill" DROP CONSTRAINT "FK_51f5774f33b409416b1352eae10"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_skill" DROP CONSTRAINT "FK_03260daf2df95f4492cc8eb00e6"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_skill" DROP CONSTRAINT "FK_49db81d31fc330a905af3c01205"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5178a92f7069a25c4281032856"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51f5774f33b409416b1352eae1"`
    );
    await queryRunner.query(`DROP TABLE "task_skill"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_03260daf2df95f4492cc8eb00e"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49db81d31fc330a905af3c0120"`
    );
    await queryRunner.query(`DROP TABLE "user_skill"`);
    await queryRunner.query(`DROP TABLE "skill"`);
  }
}
