import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { TaskStatus } from "@dewo/api/models/Task";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { GithubRequests } from "@dewo/api/testing/requests/github.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

// https://github.com/organizations/deworkxyz-testing/settings/installations/21818562
const githubRepo = "unit-tests";
const githubOrganization = "deworkxyz-testing";
const installationId = 21818562;

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
        expect(repos).toContainEqual(
          expect.objectContaining({
            name: githubRepo,
            organization: githubOrganization,
            integrationId: integration.id,
          })
        );
      });
    });
  });

  describe("Mutations", () => {
    describe("createTasksFromGithubIssues", () => {
      it("should create tasks properly", async () => {
        const { user, organization } = await fixtures.createUserOrgProject();
        const { project } = await fixtures.createProjectWithGithubIntegration(
          { organizationId: organization.id },
          {},
          {
            installationId,
            repo: githubRepo,
            organization: githubOrganization,
          }
        );

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: GithubRequests.createTasksFromGithubIssues(project.id),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const tasks = response.body.data?.project.tasks;
        expect(tasks).toHaveLength(2);

        const openTask = tasks[0];
        const closedTask = tasks[1];

        expect(openTask.name).toBe("First issue");
        expect(openTask.description).toContain(
          "This issue has a **description** with _epic_ markdown"
        );
        expect(openTask.description).toContain(
          "https://github.com/deworkxyz-testing/unit-tests/issues/1"
        );
        expect(openTask.status).toEqual(TaskStatus.TODO);
        expect(openTask.creatorId).toEqual(user.id);
        expect(openTask.githubIssue).toBeTruthy();
        expect(openTask.githubIssue.number).toBe(1);
        expect(openTask.tags).toContainEqual(
          expect.objectContaining({ color: "green", label: "github issue" })
        );
        expect(openTask.tags).toContainEqual(
          expect.objectContaining({ color: "red", label: "bug" })
        );
        expect(openTask.tags).toContainEqual(
          expect.objectContaining({ color: "yellow", label: "invalid" })
        );

        expect(closedTask.name).toBe("Closed issue");
        expect(closedTask.status).toEqual(TaskStatus.DONE);
        expect(openTask.creatorId).toEqual(user.id);

        const label = "github issue";
        const openTag = openTask.tags.find((t: any) => t.label === label);
        const closedTag = closedTask.tags.find((t: any) => t.label === label);
        expect(openTag.id).toEqual(closedTag.id);
      });
    });
  });
});
