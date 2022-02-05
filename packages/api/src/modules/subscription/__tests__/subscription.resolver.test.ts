import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { TaskService } from "../../task/task.service";
import { SubscriptionPubSubService } from "../pubsub.service";
import faker from "faker";

describe("SubscriptionResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let pubsub: SubscriptionPubSubService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    pubsub = app.get(SubscriptionPubSubService);
  });

  afterAll(() => app.close());

  describe("Subscriptions", () => {
    describe("onTaskCreated", () => {
      it("should be called after creating task", async () => {
        const spy = jest.spyOn(pubsub.client, "publish");
        const task = await fixtures.createTask();
        expect(spy).toHaveBeenCalledWith("onTaskCreated", {
          onTaskCreated: expect.objectContaining({ id: task.id }),
        });
      });
    });

    describe("onTaskUpdated", () => {
      it("should be called after updating task", async () => {
        const spy = jest.spyOn(pubsub.client, "publish");
        const task = await fixtures.createTask();
        const taskService = app.get(TaskService);

        const expectedName = faker.name.jobDescriptor();
        await taskService.update({ id: task.id, name: expectedName });

        expect(spy).toHaveBeenCalledWith("onTaskUpdated", {
          onTaskUpdated: expect.objectContaining({
            id: task.id,
            name: expectedName,
          }),
        });
      });

      it("should be called if task relation is updated", async () => {
        const spy = jest.spyOn(pubsub.client, "publish");
        const task = await fixtures.createTask();
        const taskService = app.get(TaskService);

        const assignee = await fixtures.createUser();
        await taskService.update({ id: task.id, assignees: [assignee] });

        expect(spy).toHaveBeenCalledWith("onTaskUpdated", {
          onTaskUpdated: expect.objectContaining({
            id: task.id,
            assignees: [expect.objectContaining({ id: assignee.id })],
          }),
        });
      });
    });
  });
});
