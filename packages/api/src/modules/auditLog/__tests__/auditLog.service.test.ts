import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { AuditLogService } from "../auditLog.service";
import faker from "faker";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { TaskGatingType } from "@dewo/api/models/enums/TaskGatingType";
import _ from "lodash";

describe("AuditLogService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: AuditLogService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(AuditLogService);
  });

  afterAll(() => app.close());

  describe("log", () => {
    describe("Task", () => {
      it("should log correct diffs", async () => {
        const user = await fixtures.createUser();
        const sessionId = faker.datatype.uuid();

        const tags = await Promise.all(
          _.range(3).map(() => fixtures.createTaskTag())
        );
        const assignees = await Promise.all(
          _.range(3).map(() => fixtures.createUser())
        );
        const owners = await Promise.all(
          _.range(3).map(() => fixtures.createUser())
        );

        const oldTask = await fixtures.createTask({
          tags: tags.slice(0, 2),
          assignees: assignees.slice(0, 2),
          owners: owners.slice(0, 2),
        });

        const newTask = (await fixtures.updateTask({
          id: oldTask.id,
          name: faker.lorem.words(3),
          description: faker.lorem.words(3),
          projectId: await fixtures.createProject().then((p) => p.id),
          parentTaskId: await fixtures.createTask().then((t) => t.id),
          tags: tags.slice(1, 3),
          assignees: assignees.slice(1, 3),
          owners: owners.slice(1, 3),
          storyPoints: 123,
          status: TaskStatus.DONE,
          gating: TaskGatingType.ASSIGNEES,
          dueDate: new Date(),
        })) as Task;

        const log = await service.log(oldTask, newTask, user.id, sessionId);
        expect(log).not.toBe(undefined);
        expect(log!.sessionId).toEqual(sessionId);
        // expect(log!.diff).toContainEqual({
        //   kind: "E",
        //   path: ["name"],
        //   rhs: newTask.name,
        //   lhs: oldTask.name,
        // });
        expect(log!.diff).toContainEqual({
          kind: "E",
          path: ["status"],
          rhs: newTask.status,
          lhs: oldTask.status,
        });
        // expect(log!.diff).toContainEqual({
        //   kind: "D",
        //   path: ["assigneeIds", assignees[0].id],
        //   lhs: assignees[0].id,
        // });
        // expect(log!.diff).toContainEqual({
        //   kind: "N",
        //   path: ["assigneeIds", assignees[2].id],
        //   rhs: assignees[2].id,
        // });
        // expect(log!.diff).toContainEqual({
        //   kind: "D",
        //   path: ["ownerIds", owners[0].id],
        //   lhs: owners[0].id,
        // });
        // expect(log!.diff).toContainEqual({
        //   kind: "N",
        //   path: ["ownerIds", owners[2].id],
        //   rhs: owners[2].id,
        // });
        // expect(log!.diff).toContainEqual({
        //   kind: "D",
        //   path: ["tagIds", tags[0].id],
        //   lhs: tags[0].id,
        // });
        // expect(log!.diff).toContainEqual({
        //   kind: "N",
        //   path: ["tagIds", tags[2].id],
        //   rhs: tags[2].id,
        // });
      });

      it("should not log diff if no change", async () => {
        const user = await fixtures.createUser();
        const task = await fixtures.createTask();

        const log = await service.log(task, task, user.id);
        expect(log).toBe(undefined);
      });
    });
  });
});
