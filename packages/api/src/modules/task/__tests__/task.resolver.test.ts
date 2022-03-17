import { RulePermission } from "@dewo/api/models/rbac/Rule";
import { TaskStatus } from "@dewo/api/models/Task";
import { TaskRewardTrigger } from "@dewo/api/models/TaskReward";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { TaskRequests } from "@dewo/api/testing/requests/task.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import { TaskReactionInput } from "../dto/TaskReactionInput";
import { UpdateTaskInput } from "../dto/UpdateTaskInput";
import { UpdateTaskRewardInput } from "../dto/UpdateTaskRewardInput";

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
            status: TaskStatus.TODO,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed if user is in project's org", async () => {
        const token = await fixtures.createPaymentToken();

        const name = faker.company.companyName();
        const description = faker.lorem.paragraph();
        const { user, project } = await fixtures.createUserOrgProject();
        const reward: UpdateTaskRewardInput = {
          amount: "100000",
          tokenId: token.id,
          trigger: TaskRewardTrigger.PULL_REQUEST_MERGED,
        };

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.create({
            name,
            description,
            projectId: project.id,
            status: TaskStatus.TODO,
            reward,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const task = response.body.data?.task;
        expect(task).toBeDefined();
        expect(task.name).toEqual(name);
        expect(task.description).toEqual(description);
        expect(task.project.id).toEqual(project.id);
        expect(task.reward).toBeDefined();
        expect(task.reward.amount).toEqual(reward.amount);
        expect(task.reward.token.id).toEqual(reward.tokenId);
        expect(task.reward.trigger).toEqual(reward.trigger);
        expect(task.creator).not.toEqual(null);
        expect(task.creator.id).toEqual(user.id);
      });

      xit("should allow task assignee to create subtasks", async () => {
        const assignee = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const task = await fixtures.createTask({ assignees: [assignee] });

        const name = faker.company.companyName();
        const assigneeRes = await client.request({
          app,
          auth: fixtures.createAuthToken(assignee),
          body: TaskRequests.create({
            name,
            status: TaskStatus.TODO,
            projectId: task.projectId,
            parentTaskId: task.id,
          }),
        });
        expect(assigneeRes.status).toEqual(HttpStatus.OK);
        expect(assigneeRes.body.data?.task.parentTask?.id).toEqual(task.id);
        expect(assigneeRes.body.data?.task.parentTask?.subtasks).toContainEqual(
          expect.objectContaining({ name })
        );

        const otherUserRes = await client.request({
          app,
          auth: fixtures.createAuthToken(otherUser),
          body: TaskRequests.create({
            name: "",
            status: TaskStatus.TODO,
            projectId: task.projectId,
            parentTaskId: task.id,
          }),
        });
        client.expectGqlError(otherUserRes, HttpStatus.FORBIDDEN);
      });

      it("should assign correct task numbers", async () => {
        const first = await fixtures.createUserOrgProject();
        const anotherProjectInFirst = await fixtures.createProject({
          organizationId: first.organization.id,
        });

        const second = await fixtures.createUserOrgProject();

        const createTask = (projectId: string, user: User) =>
          client
            .request({
              app,
              auth: fixtures.createAuthToken(user),
              body: TaskRequests.create({
                projectId,
                name: faker.lorem.words(5),
                status: TaskStatus.TODO,
              }),
            })
            .then((res) => res.body.data?.task);

        await expect(createTask(first.project.id, first.user)).resolves.toEqual(
          expect.objectContaining({ number: 1 })
        );
        await expect(createTask(first.project.id, first.user)).resolves.toEqual(
          expect.objectContaining({ number: 2 })
        );
        await expect(
          createTask(anotherProjectInFirst.id, first.user)
        ).resolves.toEqual(expect.objectContaining({ number: 3 }));
        await expect(
          createTask(second.project.id, second.user)
        ).resolves.toEqual(expect.objectContaining({ number: 1 }));
      });

      it("should add assignee to organization", async () => {
        const { project, user } = await fixtures.createUserOrgProject();
        const contributor = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.create({
            projectId: project.id,
            name: faker.lorem.words(5),
            status: TaskStatus.TODO,
            assigneeIds: [contributor.id],
          }),
        });
        expect(
          response.body.data?.task.project.organization.users
        ).toContainEqual(expect.objectContaining({ id: contributor.id }));
      });
    });

    describe("updateTask", () => {
      const req = (user: User, input: UpdateTaskInput) =>
        client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.update(input),
        });

      it("should successfully update task", async () => {
        const otherUser = await fixtures.createUser();
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({ projectId: project.id });

        const expectedName = faker.lorem.words(5);
        const expectedTag = await fixtures.createTaskTag({
          projectId: project.id,
        });
        const expectedStatus = TaskStatus.IN_REVIEW;

        const response = await req(user, {
          id: task.id,
          name: expectedName,
          tagIds: [expectedTag.id],
          assigneeIds: [user.id],
          status: expectedStatus,
          ownerId: otherUser.id,
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const updatedTask = response.body.data?.task;
        expect(updatedTask.name).toEqual(expectedName);
        expect(updatedTask.status).toEqual(expectedStatus);
        expect(updatedTask.tags).toHaveLength(1);
        expect(updatedTask.tags).toContainEqual(
          expect.objectContaining({ id: expectedTag.id })
        );
        expect(updatedTask.assignees).toContainEqual(
          expect.objectContaining({ id: user.id })
        );
        expect(updatedTask.owner.id).toEqual(otherUser.id);
      });

      xit("should fail if adding task from other project", async () => {
        throw new Error("Not implemented");
      });

      it("should not update name if not submitted", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({ projectId: project.id });

        const response = await req(user, {
          id: task.id,
          description: faker.lorem.words(5),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const updatedTask = response.body.data?.task;
        expect(updatedTask.name).toEqual(task.name);
      });

      it("should add assignee to organization", async () => {
        const { project, user } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({ projectId: project.id });
        const contributor = await fixtures.createUser();

        const response = await req(user, {
          id: task.id,
          assigneeIds: [contributor.id],
        });
        expect(
          response.body.data?.task.project.organization.users
        ).toContainEqual(expect.objectContaining({ id: contributor.id }));
      });

      describe("doneAt", () => {
        it("should not set doneAt if not DONE", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({ ownerId: user.id });
          const response = await req(user, {
            id: task.id,
            status: TaskStatus.IN_REVIEW,
          });
          expect(response.body.data?.task.doneAt).toBe(null);
        });

        it("should set doneAt if DONE", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({ ownerId: user.id });
          const response = await req(user, {
            id: task.id,
            status: TaskStatus.DONE,
          });
          expect(response.body.data?.task.doneAt).not.toBe(null);
        });

        it("should not update doneAt if already DONE", async () => {
          const originalDoneAt = new Date();
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({
            ownerId: user.id,
            status: TaskStatus.DONE,
            doneAt: originalDoneAt,
          });
          const response = await req(user, {
            id: task.id,
            status: TaskStatus.DONE,
          });
          expect(response.body.data?.task.doneAt).toBe(
            originalDoneAt.toISOString()
          );
        });

        it("should set doneAt to null if no longer DONE", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({
            ownerId: user.id,
            status: TaskStatus.DONE,
            doneAt: new Date(),
          });
          const response = await req(user, {
            id: task.id,
            status: TaskStatus.TODO,
          });
          expect(response.body.data?.task.doneAt).toBe(null);
        });
      });
    });

    describe("createTaskApplication", () => {
      it("should succeed and create a task application for user if status is TODO", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask({ status: TaskStatus.TODO });
        const message = faker.lorem.words(5);
        const startDate = faker.date.soon();
        const endDate = faker.date.soon();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.createApplication({
            message: message,
            startDate: startDate,
            endDate: endDate,
            userId: user.id,
            taskId: task.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.application.task;
        expect(fetched.applications).toHaveLength(1);
        const application = fetched.applications[0];
        expect(application.user.id).toEqual(user.id);
        expect(application.message).toEqual(message);
        expect(application.startDate).toEqual(startDate.toISOString());
        expect(application.endDate).toEqual(endDate.toISOString());
      });

      xit("should not succeed if status is not TODO", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask({
          status: TaskStatus.IN_PROGRESS,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.createApplication({
            message: faker.lorem.words(5),
            startDate: faker.date.soon(),
            endDate: faker.date.soon(),
            userId: user.id,
            taskId: task.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });
    });

    describe("deleteTaskApplication", () => {
      it("should succeed for the current user", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask({
          status: TaskStatus.TODO,
          assignees: [user],
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.deleteApplication({
            taskId: task.id,
            userId: user.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.task;
        expect(fetched.applications).toHaveLength(0);
      });

      it("should succeed for project admin", async () => {
        const admin = await fixtures.createUser();
        const assignee = await fixtures.createUser();
        const project = await fixtures.createProject();
        await fixtures.grantPermissions(admin.id, project.organizationId, [
          { permission: RulePermission.MANAGE_PROJECTS },
        ]);
        const task = await fixtures.createTask({
          status: TaskStatus.TODO,
          assignees: [assignee],
          projectId: project.id,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(admin),
          body: TaskRequests.deleteApplication({
            taskId: task.id,
            userId: assignee.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.task;
        expect(fetched.applications).toHaveLength(0);
      });
    });

    describe("task submissions", () => {
      describe("createTaskSubmission", () => {
        const content = faker.lorem.paragraph();

        it("should fail for anyone on normal task", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask();

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: TaskRequests.createSubmission({ taskId: task.id, content }),
          });

          client.expectGqlError(response, HttpStatus.FORBIDDEN);
        });

        it("should succeed for assignee contributor", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({ assignees: [user] });

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: TaskRequests.createSubmission({ taskId: task.id, content }),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const submission = response.body.data?.submission;
          expect(submission.userId).toEqual(user.id);
          expect(submission.taskId).toEqual(task.id);
          expect(submission.content).toEqual(content);
          expect(submission.task.submissions).toContainEqual(
            expect.objectContaining({ id: submission.id })
          );
        });

        it("should succeed for anyone on open bounty task", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({
            options: { allowOpenSubmission: true },
          });

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: TaskRequests.createSubmission({ taskId: task.id, content }),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const submission = response.body.data?.submission;
          expect(submission.userId).toEqual(user.id);
        });
      });

      describe("updateTaskSubmission", () => {
        it("should fail to update someone elses submission", async () => {
          const submission = await fixtures.createTaskSubmission();
          const user = await fixtures.createUser();
          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: TaskRequests.updateSubmission({
              taskId: submission.taskId,
              userId: submission.userId,
            }),
          });

          client.expectGqlError(response, HttpStatus.FORBIDDEN);
        });

        it("should succeed to update for creator and project admin", async () => {
          const admin = await fixtures.createUser();
          const submitter = await fixtures.createUser();
          const project = await fixtures.createProject();
          await fixtures.grantPermissions(admin.id, project.organizationId, [
            { permission: RulePermission.MANAGE_PROJECTS },
          ]);

          const task = await fixtures.createTask({
            projectId: project.id,
            assignees: [submitter],
          });
          const submission = await fixtures.createTaskSubmission({
            taskId: task.id,
            userId: submitter.id,
          });

          const req = (content: string, user: User) =>
            client.request({
              app,
              auth: fixtures.createAuthToken(user),
              body: TaskRequests.updateSubmission({
                taskId: submission.taskId,
                userId: submission.userId,
                content,
              }),
            });

          const content1 = faker.lorem.paragraph();
          const res1 = await req(content1, submitter);
          expect(res1.body.data?.submission.content).toEqual(content1);

          const content2 = faker.lorem.paragraph();
          const res2 = await req(content2, admin);
          expect(res2.body.data?.submission.content).toEqual(content2);
        });

        it("should not return submission if is deleted", async () => {
          const user = await fixtures.createUser();
          const task = await fixtures.createTask({
            options: { allowOpenSubmission: true },
          });
          const submission = await fixtures.createTaskSubmission({
            userId: user.id,
            taskId: task.id,
          });

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: TaskRequests.updateSubmission({
              taskId: submission.taskId,
              userId: submission.userId,
              deletedAt: new Date(),
            }),
          });

          expect(
            response.body.data?.submission.task.submissions
          ).not.toContainEqual(expect.objectContaining({ id: submission.id }));
        });
      });
    });

    describe("deleteTask", () => {
      it("should set task.deletedAt", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({ projectId: project.id });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.delete(task.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const deletedTask = response.body.data?.task;
        expect(deletedTask.deletedAt).not.toBe(null);
      });
    });

    describe("createTaskReaction + deleteTaskReaction", () => {
      const create = (user: User, input: TaskReactionInput) =>
        client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.createReaction(input),
        });

      const del = (user: User, input: TaskReactionInput) =>
        client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.deleteReaction(input),
        });

      it("should fail for non-contributors", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask();

        const response = await create(user, {
          taskId: task.id,
          reaction: "like",
        });
        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should add and remove reactions properly", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({ projectId: project.id });

        const res1 = await create(user, { taskId: task.id, reaction: "1" });
        expect(res1.body.data.task.reactions).toEqual([
          expect.objectContaining({ reaction: "1", userId: user.id }),
        ]);

        const res2 = await create(user, { taskId: task.id, reaction: "1" });
        expect(res2.body.data.task.reactions).toEqual([
          expect.objectContaining({ reaction: "1", userId: user.id }),
        ]);

        const res3 = await create(user, { taskId: task.id, reaction: "2" });
        expect(res3.body.data.task.reactions).toEqual([
          expect.objectContaining({ reaction: "1", userId: user.id }),
          expect.objectContaining({ reaction: "2", userId: user.id }),
        ]);

        const res4 = await del(user, { taskId: task.id, reaction: "1" });
        expect(res4.body.data.task.reactions).toEqual([
          expect.objectContaining({ reaction: "2", userId: user.id }),
        ]);
      });
    });
  });

  describe("Queries", () => {
    describe("getTasks", () => {
      it("should only return tasks with matching statuses", async () => {
        const project = await fixtures.createProject({
          createdAt: new Date(0),
        });
        const todo = await fixtures.createTask({
          status: TaskStatus.TODO,
          projectId: project.id,
        });
        const done = await fixtures.createTask({
          status: TaskStatus.DONE,
          projectId: project.id,
        });
        const response = await client.request({
          app,
          body: TaskRequests.getBatch({ statuses: [TaskStatus.TODO] }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const tasks = response.body.data?.tasks;
        expect(tasks).toContainEqual(expect.objectContaining({ id: todo.id }));
        expect(tasks).not.toContainEqual(
          expect.objectContaining({ id: done.id })
        );
      });

      it("should only return tasks with matching organizationIds", async () => {
        const first = await fixtures.createUserOrgProject();
        const second = await fixtures.createUserOrgProject();

        const firstTask = await fixtures.createTask({
          projectId: first.project.id,
        });
        const secondTask = await fixtures.createTask({
          projectId: second.project.id,
        });

        const response = await client.request({
          app,
          body: TaskRequests.getBatch({
            organizationIds: [first.organization.id],
          }),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const tasks = response.body.data?.tasks;
        expect(tasks).toContainEqual(
          expect.objectContaining({ id: firstTask.id })
        );
        expect(tasks).not.toContainEqual(
          expect.objectContaining({ id: secondTask.id })
        );
      });

      it("should not return subtasks when querying organization", async () => {
        const project = await fixtures.createProject();
        const task = await fixtures.createTask({ projectId: project.id });
        const subtask = await fixtures.createTask({
          projectId: project.id,
          parentTaskId: task.id,
        });

        const response = await client.request({
          app,
          body: TaskRequests.getBatch({
            organizationIds: [project.organizationId],
          }),
        });

        const tasks = response.body.data?.tasks;
        expect(tasks).toContainEqual(expect.objectContaining({ id: task.id }));
        expect(tasks).not.toContainEqual(
          expect.objectContaining({ id: subtask.id })
        );
      });

      it("should not return tasks from deleted project", async () => {
        const project = await fixtures.createProject();
        await fixtures.createTask({ projectId: project.id });
        await fixtures.updateProject({ id: project.id, deletedAt: new Date() });

        const response = await client.request({
          app,
          body: TaskRequests.getBatch({
            organizationIds: [project.organizationId],
          }),
        });

        const tasks = response.body.data?.tasks;
        expect(tasks).toHaveLength(0);
      });
    });
  });
});
