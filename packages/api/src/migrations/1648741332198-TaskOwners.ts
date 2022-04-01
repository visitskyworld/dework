import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskOwners1648741332198 implements MigrationInterface {
  name = "TaskOwners1648741332198";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_owners" ("taskId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_328c72d810ea792f4b1ca7bd33d" PRIMARY KEY ("taskId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_737145902f19a2f4837464bb9b" ON "task_owners" ("taskId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d8110f0d371f619138c7e24203" ON "task_owners" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "task_owners" ADD CONSTRAINT "FK_737145902f19a2f4837464bb9ba" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task_owners" ADD CONSTRAINT "FK_d8110f0d371f619138c7e242032" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );

    const mapping: { userId: string; taskId: string }[] =
      await queryRunner.query(`
        SELECT task."id" as "taskId", task."ownerId" as "userId"
        FROM task
        WHERE task."ownerId" IS NOT NULL
    `);

    await queryRunner.query(`
        INSERT INTO "task_owners" ("taskId", "userId")
        VALUES ${mapping
          .map((m) => `('${m.taskId}', '${m.userId}')`)
          .join(",\n")}
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_owners" DROP CONSTRAINT "FK_d8110f0d371f619138c7e242032"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_owners" DROP CONSTRAINT "FK_737145902f19a2f4837464bb9ba"`
    );
    await queryRunner.query(`DROP TABLE "task_owners"`);
  }
}
