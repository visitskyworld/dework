import { TaskStatusEnum } from "@dewo/api/models/Task";
import { TaskRewardTrigger } from "@dewo/api/models/TaskReward";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { ProjectRequests } from "@dewo/api/testing/requests/project.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

describe("ProjectResolver", () => {
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
    describe("createProject", () => {
      it("should fail if user is not in org", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.create({
            name: faker.company.companyName(),
            organizationId: organization.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed if user is in org", async () => {
        const name = faker.company.companyName();
        const { user, organization } = await fixtures.createUserOrgProject();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.create({
            name,
            organizationId: organization.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const project = response.body.data?.project;
        expect(project).toBeDefined();
        expect(project.name).toEqual(name);
        expect(project.organization.id).toEqual(organization.id);
      });
    });
  });

  describe("updateProject", () => {
    it("should fail if user is not in org", async () => {
      const user = await fixtures.createUser();
      const project = await fixtures.createProject();

      const response = await client.request({
        app,
        auth: fixtures.createAuthToken(user),
        body: ProjectRequests.update({
          id: project.id,
          name: faker.company.companyName(),
        }),
      });

      client.expectGqlError(response, HttpStatus.FORBIDDEN);
    });

    it("should succeed if user is in org", async () => {
      const expectedName = faker.company.companyName();
      const { user, project } = await fixtures.createUserOrgProject();

      const response = await client.request({
        app,
        auth: fixtures.createAuthToken(user),
        body: ProjectRequests.update({
          id: project.id,
          name: expectedName,
        }),
      });

      expect(response.status).toEqual(HttpStatus.OK);
      const fetched = response.body.data?.project;
      expect(fetched.name).toEqual(expectedName);
    });
  });

  describe("Queries", () => {
    describe("getProject", () => {
      it("should not return deleted tasks", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({
          projectId: project.id,
          deletedAt: new Date(),
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.get(project.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetchedProject = response.body.data?.project;
        expect(fetchedProject).toBeDefined();
        expect(fetchedProject.tasks).not.toContainEqual(
          expect.objectContaining({ id: task.id })
        );
      });

      it("should calculate taskCount", async () => {
        const { user, project } = await fixtures.createUserOrgProject();

        await fixtures.createTask({
          projectId: project.id,
          deletedAt: new Date(),
        });
        await fixtures.createTask({
          projectId: project.id,
          status: TaskStatusEnum.TODO,
          reward: {
            trigger: TaskRewardTrigger.CORE_TEAM_APPROVAL,
          },
        });
        await fixtures.createTask({
          projectId: project.id,
          status: TaskStatusEnum.TODO,
        });
        await fixtures.createTask({
          projectId: project.id,
          status: TaskStatusEnum.DONE,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.get(project.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetchedProject = response.body.data?.project;
        expect(fetchedProject).toBeDefined();
        expect(fetchedProject.taskCount).toEqual(3);
        expect(fetchedProject.doneTaskCount).toEqual(1);
        expect(fetchedProject.todoWithRewardTaskCount).toEqual(1);
      });
    });
  });
});
