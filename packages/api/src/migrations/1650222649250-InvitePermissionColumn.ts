import { MigrationInterface, QueryRunner } from "typeorm";

export class InvitePermissionColumn1650222649250 implements MigrationInterface {
  name = "InvitePermissionColumn1650222649250";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const invites: { id: string; permission: string }[] =
      await queryRunner.query(`
      SELECT
        invite.id,
        (CASE
          WHEN invite."organizationId" IS NOT NULL THEN 'MANAGE_ORGANIZATION'
          WHEN invite."projectRole" = 'ADMIN' THEN 'MANAGE_PROJECTS'
          ELSE 'VIEW_PROJECTS'
        END) as permission
      FROM invite
    `);

    await queryRunner.query(
      `CREATE TYPE "public"."invite_permission_enum" AS ENUM('MANAGE_ORGANIZATION', 'MANAGE_PROJECTS', 'MANAGE_TASKS', 'VIEW_PROJECTS')`
    );
    await queryRunner.query(
      `ALTER TABLE "invite" ADD "permission" "public"."invite_permission_enum" NULL`
    );

    for (const invite of invites) {
      await queryRunner.query(`
        UPDATE "invite"
        SET "permission" = '${invite.permission}'
        WHERE "id" = '${invite.id}'
      `);
    }

    await queryRunner.query(
      `ALTER TABLE "invite" ALTER COLUMN "permission" SET NOT NULL`
    );

    await queryRunner.query(
      `ALTER TABLE "invite" DROP COLUMN "organizationRole"`
    );
    await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "projectRole"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "permission"`);
    await queryRunner.query(`DROP TYPE "public"."invite_permission_enum"`);
    await queryRunner.query(
      `ALTER TABLE "invite" ADD "projectRole" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "invite" ADD "organizationRole" character varying`
    );
  }
}
