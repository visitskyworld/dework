import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFallbackGithubIssueSyncIntegrations1653582887510
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const integrations: {
      organizationIntegrationId: string;
      creatorId: string;
      projectId: string;
      organization: string;
      repo: string;
    }[] = await queryRunner.query(`
      SELECT
        project_integration."organizationIntegrationId",
        project_integration."projectId",
        project_integration."creatorId",
        project_integration.config->'organization' AS organization,
        project_integration.config->'repo' AS repo
      FROM project_integration
      WHERE "type" = 'GITHUB'
        AND "createdAt" < '2022-05-12'
        AND "deletedAt" IS NULL
        AND (config->'features')::jsonb ? 'SHOW_BRANCHES'
    `);

    await queryRunner.query(`
      INSERT INTO project_integration ("organizationIntegrationId", "projectId", "creatorId", "config", "type")
      VALUES ${integrations
        .map(
          (i) =>
            `('${i.organizationIntegrationId}', '${i.projectId}', '${
              i.creatorId
            }', '${JSON.stringify({
              organization: i.organization,
              repo: i.repo,
              features: ["CREATE_TASKS_FROM_ISSUES"],
            })}', 'GITHUB')`
        )
        .join(",\n")}
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
