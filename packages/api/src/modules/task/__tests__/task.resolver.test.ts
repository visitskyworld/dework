import { TaskStatus } from "@dewo/api/models/Task";
import { TaskRewardTrigger } from "@dewo/api/models/TaskReward";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { TaskRequests } from "@dewo/api/testing/requests/task.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
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
        expect(task.owner).not.toEqual(null);
        expect(task.creator.id).toEqual(user.id);
        expect(task.owner.id).toEqual(user.id);
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

      describe("organizationAdmin", () => {
        it("should succeed", async () => {
          const otherUser = await fixtures.createUser();
          const { user, project } = await fixtures.createUserOrgProject();
          const task = await fixtures.createTask({ projectId: project.id });

          const expectedName = faker.lorem.words(5);
          const expectedTag = await fixtures.createTaskTag({
            projectId: project.id,
          });
          const expectedStatus = TaskStatus.IN_REVIEW;

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: TaskRequests.update({
              id: task.id,
              name: expectedName,
              tagIds: [expectedTag.id],
              assigneeIds: [user.id],
              status: expectedStatus,
              ownerId: otherUser.id,
            }),
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
      });

      xdescribe("organizationMember", () => {
        xit("should succeed for assigned task", async () => {});
        xit("should succeed for owned task", async () => {});
        xit("should fail for other task", async () => {});
      });

      xit("should fail if adding task from other project", async () => {
        throw new Error("Not implemented");
      });

      it("should not update name if not submitted", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
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

    describe("claimTask", () => {
      it("should succeed and create a task application for user if status is TODO", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask({ status: TaskStatus.TODO });
        const message = faker.lorem.words(5);
        const startDate = faker.date.soon();
        const endDate = faker.date.soon();
        const application = {
          message: message,
          startDate: startDate,
          endDate: endDate,
        };

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.claim(task.id, application),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.task;
        expect(fetched.applications).toHaveLength(1);

        const fetchedTaskApplication = fetched.applications[0];
        expect(fetchedTaskApplication.user.id).toEqual(user.id);
        expect(fetchedTaskApplication.message).toEqual(message);
        expect(fetchedTaskApplication.startDate).toEqual(
          startDate.toISOString()
        );
        expect(fetchedTaskApplication.endDate).toEqual(endDate.toISOString());
      });

      it("should not succeed if status is not TODO", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask({
          status: TaskStatus.IN_PROGRESS,
        });
        const application = {
          message: faker.lorem.words(5),
          startDate: faker.date.soon(),
          endDate: faker.date.soon(),
        };

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.claim(task.id, application),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });
    });

    describe("unclaimTask", () => {
      it("should succeed and delete task application", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask({
          status: TaskStatus.TODO,
          assignees: [user],
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.unclaim(task.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.task;
        expect(fetched.applications).toHaveLength(0);
      });
    });

    /*
    describe("createTaskPayment", () => {
      const req = (user: User, input: CreateTaskPaymentInput) =>
        client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: TaskRequests.createPayment(input),
        });

      it("should fail if task has no reward", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({ projectId: project.id });

        const response = await req(user, {
          taskId: task.id,
          data: { safeTxHash: faker.datatype.uuid() },
        });

        client.expectGqlError(response, HttpStatus.BAD_REQUEST);
        client.expectGqlErrorMessage(
          response,
          "Cannot pay for task without reward"
        );
      });

      it("should fail if task has no assignees", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({
          projectId: project.id,
          reward: { currency: "ETH" },
        });

        const response = await req(user, {
          taskId: task.id,
          data: { safeTxHash: faker.datatype.uuid() },
        });

        client.expectGqlError(response, HttpStatus.BAD_REQUEST);
        client.expectGqlErrorMessage(
          response,
          "Cannot pay for task without assignees"
        );
      });

      it("should fail if project has no payment method", async () => {
        const { user, project } = await fixtures.createUserOrgProject();
        const task = await fixtures.createTask({
          projectId: project.id,
          assignees: [user],
          reward: { currency: "ETH" },
        });

        const response = await req(user, {
          taskId: task.id,
          data: { safeTxHash: faker.datatype.uuid() },
        });

        client.expectGqlError(response, HttpStatus.BAD_REQUEST);
        client.expectGqlErrorMessage(
          response,
          "Project is missing payment method"
        );
      });

      it("should fail if user has no payment method", async () => {
        const { user, project } = await fixtures.createUserOrgProject({
          project: {
            paymentMethodId: await fixtures
              .createPaymentMethod()
              .then((p) => p.id),
          },
        });
        const task = await fixtures.createTask({
          projectId: project.id,
          assignees: [user],
          reward: { currency: "ETH" },
        });

        const response = await req(user, {
          taskId: task.id,
          data: { safeTxHash: faker.datatype.uuid() },
        });

        client.expectGqlError(response, HttpStatus.BAD_REQUEST);
        client.expectGqlErrorMessage(
          response,
          "User is missing payment method"
        );
      });

      describe("payment.type = GNOSIS_SAFE", () => {
        it("should create payment", async () => {
          const safeTxHash = faker.datatype.uuid();

          const { user, project } = await fixtures.createUserOrgProject({
            user: {
              paymentMethodId: await fixtures
                .createPaymentMethod({ type: PaymentMethodType.GNOSIS_SAFE })
                .then((p) => p.id),
            },
            project: {
              paymentMethodId: await fixtures
                .createPaymentMethod({ type: PaymentMethodType.GNOSIS_SAFE })
                .then((p) => p.id),
            },
          });
          const task = await fixtures.createTask({
            projectId: project.id,
            assignees: [user],
            reward: { currency: "ETH" },
          });

          const response = await req(user, {
            taskId: task.id,
            data: { safeTxHash },
          });
          expect(response.status).toEqual(HttpStatus.OK);
          const fetched = response.body.data?.task;
          expect(fetched.reward.payment).not.toBe(null);
          expect(fetched.reward.payment.txHash).toEqual(null);
          expect(fetched.reward.payment.status).toEqual(
            PaymentStatus.PROCESSING
          );
          expect(fetched.reward.payment.data).toEqual({ safeTxHash });
        });

        xit("should fail if data.safeTxHash not provided", () => {});
      });

      xdescribe("payment.type = PHANTOM", () => {
        it("should fail if txHash not provided", () => {});
      });

      xdescribe("payment.type = METAMASK", () => {
        it("should fail if txHash not provided", () => {});
      });

      // status AWAITING_SIGNATURE
    });
    */

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
  });

  describe("Queries", () => {
    describe("getTasks", () => {
      it("should only return tasks with matching statuses", async () => {
        const todo = await fixtures.createTask({ status: TaskStatus.TODO });
        const done = await fixtures.createTask({ status: TaskStatus.DONE });
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

      it("should only return tasks with matching ids", async () => {});
    });
  });
});
