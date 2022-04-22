import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultTaskPriorityToNone1650634156380
  implements MigrationInterface
{
  name = "DefaultTaskPriorityToNone1650634156380";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."task_priority_enum" RENAME TO "task_priority_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_priority_enum" AS ENUM('URGENT', 'HIGH', 'MEDIUM', 'LOW', 'NONE')`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ALTER COLUMN "priority" TYPE "public"."task_priority_enum" USING "priority"::"text"::"public"."task_priority_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ALTER COLUMN "priority" SET DEFAULT 'NONE'`
    );

    await queryRunner.query(`
      UPDATE task
      SET priority = 'NONE'
      WHERE id IN (
        SELECT id
        FROM task
        WHERE priority IS NULL
      )
    `);

    await queryRunner.query(`DROP TYPE "public"."task_priority_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "task" ALTER COLUMN "priority" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" ALTER COLUMN "priority" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ALTER COLUMN "priority" DROP NOT NULL`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_priority_enum_old" AS ENUM('URGENT', 'HIGH', 'MEDIUM', 'LOW')`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ALTER COLUMN "priority" TYPE "public"."task_priority_enum_old" USING "priority"::"text"::"public"."task_priority_enum_old"`
    );
    await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."task_priority_enum_old" RENAME TO "task_priority_enum"`
    );
  }
}
