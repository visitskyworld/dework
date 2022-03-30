import {
  DiscordProjectIntegrationFeature,
  ProjectIntegrationType,
} from "@dewo/api/models/ProjectIntegration";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { IntegrationRequests } from "@dewo/api/testing/requests/integration.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

describe("IntegrationResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Mutations", () => {
    describe("createProjectIntegration", () => {
      it("should succeed for admins", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: IntegrationRequests.createProjectIntegration({
            projectId: project.id,
            type: ProjectIntegrationType.DISCORD,
            config: {
              channelId: "123",
              name: "test",
              features: [
                DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
              ],
            },
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.integration;
        expect(fetched.type).toEqual(ProjectIntegrationType.DISCORD);
        expect(fetched.project.id).toEqual(project.id);
        expect(fetched.project.integrations).toHaveLength(1);
        expect(fetched.project.integrations).toContainEqual(
          expect.objectContaining({ id: fetched.id })
        );
      });
    });

    describe("updateProjectIntegration", () => {
      it("should not return deleted integration", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const integration = await fixtures.createProjectIntegration({
          type: ProjectIntegrationType.DISCORD,
          projectId: project.id,
          config: {
            channelId: "123",
            name: "test",
            features: [
              DiscordProjectIntegrationFeature.POST_TASK_UPDATES_TO_THREAD_PER_TASK,
            ],
          },
        });
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: IntegrationRequests.updateProjectIntegration({
            id: integration.id,
            deletedAt: new Date(),
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.integration;
        expect(fetched.type).toEqual(ProjectIntegrationType.DISCORD);
        expect(fetched.project.id).toEqual(project.id);
        expect(fetched.project.integrations).toHaveLength(0);
      });
    });
  });
});
