import _ from "lodash";
import Bluebird from "bluebird";
import { MigrationInterface, QueryRunner } from "typeorm";

export class RBAC1647556947349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*

    Before running migration:
    - [X] Let DB schema sync
    - [X] Import Discord roles using endpoint
    
    - [X] Create fallback/@everyone role for each organization
    - [X] OrganizationMember.ADMIN => grant personal permissions MANAGE_ORGANIZATION, MANAGE_PROJECTS
    - [X] OrganizationMember.FOLLOWER => grant fallback/@everyone role
    - [X] ProjectMember.ADMIN => grant personal permissions for project: MANAGE_PROJECTS, VIEW_PROJECTS, SUGGEST_AND_VOTE
    - [X] ProjectMember.CONTRIBUTOR => grant personal permissions for project: VIEW_PROJECTS, SUGGEST_AND_VOTE
    needs Discord roles to be synced first
    - [X] Project.visibility => if private, add VIEW_PROJECTS inverted true
    - [X] Make sure OrganizationMember.ADMIN/OWNER can see private projects, even if not added as project member

    - [X] ProjectIntegration.DISCORD_ROLE_GATE => find role by organizationId, source = 'DISCORD', externalId = discordRoleId. Add rules depending on ADMIN/CONTRIBUTOR (like ProjectMember above)
    */

    const organizations: { id: string }[] = await queryRunner.query(`
      SELECT id
      FROM organization
      `);
    // WHERE id = '09bb512d-0641-4b11-be7d-cef5490698e8' -- metaguild
    // WHERE id = 'dde641cb-b50e-403f-955a-f83c154e441f' -- dework
    await Bluebird.map(
      organizations,
      (organization, index) => {
        console.log(index);
        return this.migrateOrganization(queryRunner, organization.id);
      },
      { concurrency: 10 }
    );
  }

  private async migrateOrganization(
    queryRunner: QueryRunner,
    organizationId: string
  ): Promise<void> {
    const [fallbackRole]: [{ id: string }] = await queryRunner.query(`
      INSERT INTO "role" ("name", "color", "fallback", "organizationId")
      VALUES ('@everyone', 'grey', TRUE, '${organizationId}')
      RETURNING id
    `);

    await queryRunner.query(`
      INSERT INTO "rule" ("roleId", "permission")
      VALUES ('${fallbackRole.id}', 'VIEW_PROJECTS')
    `);

    const orgMembers: [
      { userId: string; role: "OWNER" | "ADMIN" | "FOLLOWER" }
    ] = await queryRunner.query(`
      SELECT "userId", "role"
      FROM organization_member
      WHERE "organizationId" = '${organizationId}'
    `);
    const projMembers: [
      { userId: string; role: "ADMIN" | "CONTRIBUTOR"; projectId: string }
    ] = await queryRunner.query(`
      SELECT "userId", "role", "projectId"
      FROM project_member
      INNER JOIN project ON project.id = project_member."projectId"
      WHERE project."organizationId" = '${organizationId}'
    `);

    const personalRoleMapping = await this.createPersonalRoleMapping(
      queryRunner,
      organizationId,
      _.uniq([
        ...orgMembers.map((m) => m.userId),
        ...projMembers.map((m) => m.userId),
      ])
    );

    if (!!orgMembers.length) {
      await queryRunner.query(`
        INSERT INTO user_role ("userId", "roleId")
        VALUES ${orgMembers
          .map((member) => `('${member.userId}', '${fallbackRole.id}')`)
          .join(",\n")}
      `);

      const adminsAndOwners = orgMembers.filter((member) =>
        ["OWNER", "ADMIN"].includes(member.role)
      );
      if (!!adminsAndOwners.length) {
        await queryRunner.query(`
          INSERT INTO "rule" ("roleId", "permission")
          VALUES ${adminsAndOwners
            .map((member) => [
              `('${
                personalRoleMapping[member.userId]
              }', 'MANAGE_ORGANIZATION')`,
              `('${personalRoleMapping[member.userId]}', 'MANAGE_PROJECTS')`,
              `('${personalRoleMapping[member.userId]}', 'SUGGEST_AND_VOTE')`,
            ])
            .flat()
            .join(",\n")}
        `);
      }
    }

    const projects: [{ id: string; visibility: "PUBLIC" | "PRIVATE" }] =
      await queryRunner.query(`
      SELECT id, visibility
      FROM project
      WHERE "organizationId" = '${organizationId}'
    `);

    for (const project of projects) {
      const admins = projMembers.filter(
        (m) => m.role === "ADMIN" && m.projectId === project.id
      );
      const contributors = projMembers.filter(
        (m) => m.role === "CONTRIBUTOR" && m.projectId === project.id
      );
      const viewers = orgMembers.filter(
        (o) =>
          ["OWNER", "ADMIN"].includes(o.role) &&
          !admins.some((a) => a.userId === o.userId) &&
          !contributors.some((c) => c.userId === o.userId)
      );

      const isPrivate = project.visibility === "PRIVATE";

      await Promise.all([
        isPrivate &&
          queryRunner.query(`
            INSERT INTO "rule" ("roleId", "permission", "inverted", "projectId")
            VALUES ('${fallbackRole.id}', 'VIEW_PROJECTS', TRUE, '${project.id}')
          `),
        !!admins.length &&
          queryRunner.query(`
            INSERT INTO "rule" ("roleId", "permission", "projectId")
            VALUES ${admins
              .map((m) =>
                this.permissionsForRole("ADMIN", isPrivate).map(
                  (p) =>
                    `('${personalRoleMapping[m.userId]}', '${p}', '${
                      project.id
                    }')`
                )
              )
              .flat()
              .join(",\n")}
          `),
        !!contributors.length &&
          queryRunner.query(`
            INSERT INTO "rule" ("roleId", "permission", "projectId")
            VALUES ${contributors
              .map((m) =>
                this.permissionsForRole("CONTRIBUTOR", isPrivate).map(
                  (p) =>
                    `('${personalRoleMapping[m.userId]}', '${p}', '${
                      project.id
                    }')`
                )
              )
              .flat()
              .join(",\n")}
          `),
        isPrivate &&
          !!viewers.length &&
          queryRunner.query(`
            INSERT INTO "rule" ("roleId", "permission", "projectId")
            VALUES ${viewers
              .map((m) =>
                this.permissionsForRole(undefined, isPrivate).map(
                  (p) =>
                    `('${personalRoleMapping[m.userId]}', '${p}', '${
                      project.id
                    }')`
                )
              )
              .flat()
              .join(",\n")}
          `),
      ]);

      const discordRoleGates: [
        {
          config: {
            projectRole: "ADMIN" | "CONTRIBUTOR";
            discordRoleIds: string[];
          };
        }
      ] = await queryRunner.query(`
        SELECT config
        FROM project_integration
        WHERE project_integration."projectId" = '${project.id}'
          AND project_integration."type" = 'DISCORD_ROLE_GATE'
          AND project_integration."deletedAt" IS NULL
      `);

      for (const gate of discordRoleGates) {
        for (const discordRoleId of gate.config.discordRoleIds) {
          const roleId = await queryRunner
            .query(
              `
              SELECT id
              FROM role
              WHERE "source" = 'DISCORD'
                AND "externalId" = '${discordRoleId}'
                AND "organizationId" = '${organizationId}'
              LIMIT 1
              `
            )
            .then((roles) => roles[0]?.id);

          if (!!roleId) {
            const permissions = this.permissionsForRole(
              gate.config.projectRole,
              isPrivate
            );
            if (!!permissions.length) {
              await queryRunner.query(`
                INSERT INTO "rule" ("roleId", "permission", "projectId")
                VALUES ${this.permissionsForRole(
                  gate.config.projectRole,
                  isPrivate
                )
                  .map((p) => `('${roleId}', '${p}', '${project.id}')`)
                  .join(",\n")}
              `);
            }
          } else {
            console.warn(
              "Failed to migrate Discord role: ",
              JSON.stringify({ discordRoleId, organizationId, gate })
            );
          }
        }
      }
    }
  }

  private permissionsForRole(
    projectRole: "ADMIN" | "CONTRIBUTOR" | undefined,
    isPrivate: boolean
  ): string[] {
    const permissions: string[] = [];
    if (isPrivate) permissions.push("VIEW_PROJECTS");
    if (projectRole === "ADMIN") {
      permissions.push("MANAGE_PROJECTS", "SUGGEST_AND_VOTE");
    }
    if (projectRole === "CONTRIBUTOR") {
      permissions.push("SUGGEST_AND_VOTE");
    }
    return permissions;
  }

  private async createPersonalRoleMapping(
    queryRunner: QueryRunner,
    organizationId: string,
    userIds: string[]
  ): Promise<Record<string, string>> {
    const mapping: Record<string, string> = {};
    for (const userId of userIds) {
      const [personalRole]: [{ id: string }] = await queryRunner.query(`
        INSERT INTO "role" ("name", "color", "fallback", "organizationId", "userId")
        VALUES ('', '', FALSE, '${organizationId}', '${userId}')
        RETURNING id
      `);
      await queryRunner.query(`
        INSERT INTO user_role ("userId", "roleId")
        VALUES ('${userId}', '${personalRole.id}')
      `);
      mapping[userId] = personalRole.id;
    }
    return mapping;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no going back :)
    // await queryRunner.query(`DELETE FROM role where "fallback" IS TRUE`);
    await queryRunner.query(`DELETE FROM role`);
  }
}
