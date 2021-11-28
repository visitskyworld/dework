import { User } from "@dewo/api/models/User";
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
            description: faker.lorem.paragraph(),
            projectId: project.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if user is in project's org", async () => {
        const name = faker.company.companyName();
        const description = faker.lorem.paragraph();
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
            description,
            projectId: project.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const task = response.body.data?.task;
        expect(task).toBeDefined();
        expect(task.name).toEqual(name);
        expect(task.description).toEqual(description);
        expect(task.project.id).toEqual(project.id);
      });
    });

    describe("updateTask", () => {
      xit("should fail if user is not in project's org", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.update({
            id: task.id,
            name: faker.lorem.words(5),
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if user is in project's org", async () => {
        const expectedName = faker.lorem.words(5);

        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const project = await fixtures.createProject({
          organizationId: organization.id,
        });
        const task = await fixtures.createTask({ projectId: project.id });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.update({
            id: task.id,
            name: expectedName,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const updatedTask = response.body.data?.task;
        expect(updatedTask.name).toEqual(expectedName);
      });

      it("should not update name if not submitted", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const project = await fixtures.createProject({
          organizationId: organization.id,
        });
        const task = await fixtures.createTask({ projectId: project.id });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.update({
            id: task.id,
            description: faker.lorem.words(5),
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const updatedTask = response.body.data?.task;
        expect(updatedTask.name).toEqual(task.name);
      });
    });
  });
});
