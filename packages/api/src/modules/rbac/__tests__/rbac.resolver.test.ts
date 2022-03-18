import { RulePermission } from "@dewo/api/models/rbac/Rule";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { ProjectRequests } from "@dewo/api/testing/requests/project.requests";
import { RbacRequests } from "@dewo/api/testing/requests/rbac.requests";
import { TaskRequests } from "@dewo/api/testing/requests/task.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import { CreateRuleInput } from "../dto/CreateRuleInput";

describe("RbacResolver", () => {
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
    describe("getProject", () => {
      it("should return public project if VIEW_PROJECTS is disabled on org level, and enabled on project level", async () => {
        const organization = await fixtures.createOrganization();
        const privateProject = await fixtures.createProject({
          organizationId: organization.id,
        });
        const publicProject = await fixtures.createProject({
          organizationId: organization.id,
        });

        const user = await fixtures.createUser();
        await fixtures.grantPermissions(user.id, organization.id, [
          { permission: RulePermission.VIEW_PROJECTS, inverted: true },
          {
            permission: RulePermission.VIEW_PROJECTS,
            projectId: publicProject.id,
          },
        ]);

        const privateResponse = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.get(privateProject.id),
        });
        client.expectGqlError(privateResponse, HttpStatus.FORBIDDEN);
        expect(privateResponse.body.data?.project).not.toBeDefined();

        const publicResponse = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: ProjectRequests.get(publicProject.id),
        });
        expect(publicResponse.body.data?.project).toBeDefined();
      });
    });

    describe("getTask", () => {
      describe("applications and submissions", () => {
        let admin: User;
        let owner: User;
        let contributor: User;
        let task: Task;

        beforeAll(async () => {
          const project = await fixtures.createProject();

          admin = await fixtures.createUser();
          owner = await fixtures.createUser();
          contributor = await fixtures.createUser();
          const otherUser = await fixtures.createUser();

          await fixtures.grantPermissions(admin.id, project.organizationId, [
            { permission: RulePermission.MANAGE_PROJECTS },
          ]);

          task = await fixtures.createTask({
            projectId: project.id,
            ownerId: owner.id,
          });

          for (const userId of [contributor.id, otherUser.id]) {
            await fixtures.createTaskSubmission({ userId, taskId: task.id });
            await fixtures.createTaskApplication({ userId, taskId: task.id });
          }
        });

        it("should return all for admin", async () => {
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(admin),
            body: TaskRequests.get(task.id),
          });

          expect(res.body.data?.task.applications).toHaveLength(2);
          expect(res.body.data?.task.submissions).toHaveLength(2);
        });

        it("should return all for owner", async () => {
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(owner),
            body: TaskRequests.get(task.id),
          });

          expect(res.body.data?.task.applications).toHaveLength(2);
          expect(res.body.data?.task.submissions).toHaveLength(2);
        });

        xit("should return your own for contributor", async () => {
          const res = await client.request({
            app,
            auth: fixtures.createAuthToken(contributor),
            body: TaskRequests.get(task.id),
          });

          expect(res.body.data?.task.applications).toHaveLength(1);
          expect(res.body.data?.task.applications).toContain(
            expect.objectContaining({ userId: contributor.id })
          );

          expect(res.body.data?.task.submissions).toHaveLength(1);
          expect(res.body.data?.task.submissions).toContain(
            expect.objectContaining({ userId: contributor.id })
          );
        });
      });
    });

    describe("updateTask", () => {
      it("should allow task owner to update all fields", async () => {
        const owner = await fixtures.createUser();
        const task = await fixtures.createTask({
          ownerId: owner.id,
          status: TaskStatus.TODO,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(owner),
          body: TaskRequests.update({
            id: task.id,
            status: TaskStatus.DONE,
            name: "done",
          }),
        });
        const fetchedTask = response.body.data?.task;
        expect(fetchedTask).toBeDefined();
        expect(fetchedTask.status).toEqual(TaskStatus.DONE);
        expect(fetchedTask.name).toEqual("done");
      });

      it("should allow task assignee update status, but not other fields", async () => {
        const assignee = await fixtures.createUser();
        const task = await fixtures.createTask({
          assignees: [assignee],
          status: TaskStatus.TODO,
        });

        const updateAllFieldsResponse = await client.request({
          app,
          auth: fixtures.createAuthToken(assignee),
          body: TaskRequests.update({
            id: task.id,
            name: "in review",
            status: TaskStatus.IN_REVIEW,
          }),
        });
        client.expectGqlError(updateAllFieldsResponse, HttpStatus.FORBIDDEN);

        const updateOnlyStatusResponse = await client.request({
          app,
          auth: fixtures.createAuthToken(assignee),
          body: TaskRequests.update({
            id: task.id,
            status: TaskStatus.IN_REVIEW,
          }),
        });
        expect(updateOnlyStatusResponse.body.data?.task.status).toEqual(
          TaskStatus.IN_REVIEW
        );
      });
    });
  });

  describe("Mutations", () => {
    describe("createRole", () => {
      it("should fail for user without role", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRole({
            name: faker.lorem.word(),
            color: faker.lorem.word(),
            organizationId: organization.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed for user with MANAGE_ORGANIZATION permission", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();
        await fixtures.grantPermissions(user.id, organization.id, [
          { permission: RulePermission.MANAGE_ORGANIZATION },
        ]);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRole({
            name: faker.lorem.word(),
            color: faker.lorem.word(),
            organizationId: organization.id,
          }),
        });

        const role = response.body.data?.role;
        expect(role).toBeDefined();
        expect(role!.organizationId).toEqual(organization.id);
      });
    });

    describe("createRule", () => {
      it("should fail for user without role", async () => {
        const role = await fixtures.createRole();
        const user = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRule({
            permission: RulePermission.VIEW_PROJECTS,
            roleId: role.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed for user with MANAGE_ORGANIZATION permission", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();
        await fixtures.grantPermissions(user.id, organization.id, [
          { permission: RulePermission.MANAGE_ORGANIZATION },
        ]);

        const role = await fixtures.createRole({
          organizationId: organization.id,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRule({
            permission: RulePermission.VIEW_PROJECTS,
            roleId: role.id,
          }),
        });

        const rule = response.body.data?.rule;
        expect(rule).toBeDefined();
        expect(rule!.roleId).toEqual(role.id);
        expect(rule!.permission).toEqual(RulePermission.VIEW_PROJECTS);
      });

      it("should return existing rule if matches", async () => {
        const { user, organization } = await fixtures.createUserOrgProject();
        const role = await fixtures.createRole({
          organizationId: organization.id,
        });

        const req = (input: CreateRuleInput) =>
          client
            .request({
              app,
              auth: fixtures.createAuthToken(user),
              body: RbacRequests.createRule(input),
            })
            .then((res) => res.body.data.rule);

        const firstRule = await req({
          roleId: role.id,
          permission: RulePermission.VIEW_PROJECTS,
        });
        expect(firstRule.role.id).toEqual(role.id);
        expect(firstRule.role.rules).toHaveLength(1);

        const duplicateRule = await req({
          roleId: role.id,
          permission: RulePermission.VIEW_PROJECTS,
        });
        expect(duplicateRule.id).toEqual(firstRule.id);
        expect(duplicateRule.role.rules).toHaveLength(1);
      });
    });

    describe("addRole", () => {
      it("should not fail when adding the same role twice to a user", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();
        await fixtures.grantPermissions(user.id, organization.id, [
          { permission: RulePermission.MANAGE_ORGANIZATION },
        ]);

        const role = await fixtures.createRole({
          organizationId: organization.id,
        });

        const res1 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.addRole(user.id, role.id),
        });
        expect(res1.body.data?.user.roles).toContainEqual(
          expect.objectContaining({ id: role.id })
        );

        const res2 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.addRole(user.id, role.id),
        });
        expect(res2.body.data?.user.roles).toContainEqual(
          expect.objectContaining({ id: role.id })
        );
      });
    });
  });
});
