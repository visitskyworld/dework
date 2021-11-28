import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { TaskRequests } from "@dewo/api/testing/requests/task.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

describe("TaskResolver", () => {
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
    describe("createTask", () => {
      it("should fail if user is not in project's org", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const project = await fixtures.createProject({
          organizationId: organization.id,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.create({
            name: faker.lorem.words(5),
            projectId: project.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if user is in project's org", async () => {
        const name = faker.company.companyName();
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization({
          users: [user],
        });
        const project = await fixtures.createProject({
          organizationId: organization.id,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.create({
            name,
            projectId: project.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const task = response.body.data?.task;
        expect(task).toBeDefined();
        expect(task.name).toEqual(name);
        expect(task.project.id).toEqual(project.id);
      });
    });
  });
});
