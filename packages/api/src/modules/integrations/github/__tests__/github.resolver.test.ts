import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { GithubRequests } from "@dewo/api/testing/requests/github.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

const githubRepo = "unit-tests";
const githubOrganization = "deworkxyz-testing";
const installationId = "21816200";

describe("GithubResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Queries", () => {
    describe("getGithubRepos", () => {
      it("should fail if organization doesn't have integration", async () => {
        const organization = await fixtures.createOrganization();
        const response = await client.request({
          app,
          body: GithubRequests.getRepos(organization.id),
        });

        client.expectGqlError(response, HttpStatus.NOT_FOUND);
      });

      it("should return github repo", async () => {
        const organization = await fixtures.createOrganization();
        const integration = await fixtures.createOrganizationIntegration({
          organizationId: organization.id,
          type: OrganizationIntegrationType.GITHUB,
          config: { installationId },
        });

        const response = await client.request({
          app,
          body: GithubRequests.getRepos(organization.id),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const repos = response.body.data?.repos;
        expect(repos).toHaveLength(1);
        expect(repos[0].name).toEqual(githubRepo);
        expect(repos[0].organization).toEqual(githubOrganization);
        expect(repos[0].integrationId).toEqual(integration.id);
      });
    });
  });
});
