import { Task, TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { TaskUpdatedEvent } from "../../task/task.events";
import { NotificationService } from "../notification.service";

describe("NotificationService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: NotificationService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(NotificationService);
  });

  afterAll(() => app.close());

  async function update(prev: Partial<Task>, next: Partial<Task>, user?: User) {
    const prevTask = await fixtures.createTask(prev);
    const task = await fixtures.updateTask({ id: prevTask.id, ...next });
    await service.process(new TaskUpdatedEvent(task!, prevTask, user?.id));
    return { task: task!, user };
  }

  describe("status change", () => {
    let assignees: [User, User];
    let owners: [User, User];

    beforeEach(async () => {
      assignees = [await fixtures.createUser(), await fixtures.createUser()];
      owners = [await fixtures.createUser(), await fixtures.createUser()];
    });

    it("should send in progress update to owners", async () => {
      const { task } = await update(
        { assignees, owners },
        { status: TaskStatus.IN_PROGRESS },
        owners[0]
      );
      await expect(assignees[0].notifications).resolves.toHaveLength(0);
      await expect(assignees[1].notifications).resolves.toHaveLength(0);
      await expect(owners[0].notifications).resolves.toHaveLength(0);
      await expect(owners[1].notifications).resolves.toHaveLength(1);
      await expect(owners[1].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `Task in progress: ${task.name}`,
        })
      );
    });

    it("should send in review update to owners", async () => {
      const { task } = await update(
        { assignees, owners },
        { status: TaskStatus.IN_REVIEW },
        owners[0]
      );
      await expect(assignees[0].notifications).resolves.toHaveLength(0);
      await expect(assignees[1].notifications).resolves.toHaveLength(0);
      await expect(owners[0].notifications).resolves.toHaveLength(0);
      await expect(owners[1].notifications).resolves.toHaveLength(1);
      await expect(owners[1].notifications).resolves.toContainEqual(
        expect.objectContaining({
          taskId: task.id,
          message: `Task ready for review: ${task.name}`,
        })
      );
    });
  });
});
