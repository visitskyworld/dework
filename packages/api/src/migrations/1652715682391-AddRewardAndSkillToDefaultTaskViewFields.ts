import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRewardAndSkillToDefaultTaskViewFields1652715682391
  implements MigrationInterface
{
  name = "AddRewardAndSkillToDefaultTaskViewFields1652715682391";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" ALTER COLUMN "fields" SET DEFAULT '["status","gating","name","priority","dueDate","skills","tags","reward","assignees","button"]'`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" ADD CONSTRAINT "FK_c1c6e1c8d7c7971e234a768419c" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" ADD CONSTRAINT "FK_b421e65f5ffa680b8536fba569a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(`
        UPDATE task_view
        SET fields = CAST('${JSON.stringify([
          "status",
          "gating",
          "name",
          "priority",
          "dueDate",
          "skills",
          "tags",
          "reward",
          "assignees",
          "button",
        ])}' AS json) 
        WHERE fields::TEXT = '${JSON.stringify([
          "status",
          "gating",
          "assignees",
          "name",
          "tags",
          "button",
          "dueDate",
          "priority",
        ])}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_view" DROP CONSTRAINT "FK_b421e65f5ffa680b8536fba569a"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" DROP CONSTRAINT "FK_c1c6e1c8d7c7971e234a768419c"`
    );
    await queryRunner.query(
      `ALTER TABLE "task_view" ALTER COLUMN "fields" SET DEFAULT '["status","gating","name","priority","dueDate","skills","tags","assignees","button"]'`
    );
  }
}
