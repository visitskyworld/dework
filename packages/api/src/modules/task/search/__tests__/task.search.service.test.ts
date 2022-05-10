import { Language } from "@dewo/api/models/enums/Language";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { Project } from "@dewo/api/models/Project";
import { Task, TaskPriority, TaskStatus } from "@dewo/api/models/Task";
import {
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/api/models/TaskView";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import Bluebird from "bluebird";
import _ from "lodash";
import moment from "moment";
import { SearchTasksInput } from "../dto/SearchTasksInput";
import { TaskSearchService } from "../task.search.service";

describe("TaskSearchService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: TaskSearchService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(TaskSearchService);
  });

  afterAll(() => app.close());

  describe("search", () => {
    it("should return matching task", async () => {
      const user = await fixtures.createUser();

      const matchingTasks = await Promise.all([
        fixtures.createTask({
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          assignees: [user],
        }),
        fixtures.createTask({
          status: TaskStatus.TODO,
          priority: TaskPriority.URGENT,
          assignees: [user],
        }),
      ]);
      const notMatchingTasks = await Promise.all([
        fixtures.createTask({
          status: TaskStatus.TODO,
          priority: TaskPriority.LOW,
          assignees: [user],
        }),
        fixtures.createTask({
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          assignees: [user],
        }),
        fixtures.createTask({
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          assignees: [],
        }),
        fixtures.createTask({
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          assignees: [user],
          reward: {},
        }),
      ]);

      await service.index([...matchingTasks, ...notMatchingTasks], true);

      const res = await service.search({
        size: 10,
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
        statuses: [TaskStatus.TODO],
        priorities: [TaskPriority.HIGH, TaskPriority.URGENT],
        assigneeIds: [user.id],
        hasReward: false,
      });

      for (const task of matchingTasks) {
        expect(res.tasks).toContainEqual(
          expect.objectContaining({ id: task.id })
        );
      }

      for (const task of notMatchingTasks) {
        expect(res.tasks).not.toContainEqual(
          expect.objectContaining({ id: task.id })
        );
      }
    });

    it("should return unassigned tasks", async () => {
      const user = await fixtures.createUser();
      const project = await fixtures.createProject();
      const assignedTask = await fixtures.createTask({
        projectId: project.id,
        assignees: [user],
      });
      const unassignedTask = await fixtures.createTask({
        projectId: project.id,
      });
      await service.index([assignedTask, unassignedTask], true);

      const res = await service.search({
        projectIds: [project.id],
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
        assigneeIds: [null],
      });

      expect(res.tasks).toContainEqual(
        expect.objectContaining({ id: unassignedTask.id })
      );
      expect(res.tasks).not.toContainEqual(
        expect.objectContaining({ id: assignedTask.id })
      );
    });

    it("should not return spam tasks", async () => {
      const project = await fixtures.createProject({ createdAt: new Date(0) });
      const spammyTasks = await Promise.all([
        fixtures.createTask({ projectId: project.id, name: "demo" }),
        fixtures.createTask({ projectId: project.id, name: "test" }),
        fixtures.createTask({ projectId: project.id, createdAt: new Date(0) }),
      ]);
      const notSpammyTask = await fixtures.createTask({
        projectId: project.id,
      });
      await service.index([...spammyTasks, notSpammyTask], true);

      const res = await service.search({
        projectIds: [project.id],
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
        spam: false,
      });

      for (const task of spammyTasks) {
        expect(res.tasks).not.toContainEqual(
          expect.objectContaining({ id: task.id })
        );
      }
      expect(res.tasks).toContainEqual(
        expect.objectContaining({ id: notSpammyTask.id })
      );
    });

    it("should return chinese tasks", async () => {
      const project = await fixtures.createProject();
      const englishTask = await fixtures.createTask({ projectId: project.id });
      const chineseTask = await fixtures.createTask({
        projectId: project.id,
        name: "5.2-5 Ro业周",
      });

      await service.index([englishTask, chineseTask], true);

      const res = await service.search({
        projectIds: [project.id],
        languages: [Language.CHINESE],
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
      });

      expect(res.tasks).toContainEqual(
        expect.objectContaining({ id: chineseTask.id })
      );
      expect(res.tasks).not.toContainEqual(
        expect.objectContaining({ id: englishTask.id })
      );
    });

    it("should not return private tasks", async () => {
      const organization = await fixtures.createOrganization();
      const privateProject = await fixtures.createProject({
        organizationId: organization.id,
      });
      const everyoneRole = await organization.roles.then((r) =>
        r.find((r) => r.fallback)
      );
      await fixtures.createRule({
        roleId: everyoneRole!.id,
        projectId: privateProject.id,
        permission: RulePermission.VIEW_PROJECTS,
        inverted: true,
      });

      const task = await fixtures.createTask({ projectId: privateProject.id });
      await service.index([task], true);

      const res = await service.search({
        projectIds: [privateProject.id],
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
        public: true,
      });

      expect(res.tasks).not.toContainEqual(
        expect.objectContaining({ id: task.id })
      );
    });

    it("should query roles correctly", async () => {
      const role = await fixtures.createRole();

      const task = await fixtures.createTask();
      await service.index([task], true);

      const filter: SearchTasksInput = {
        projectIds: [task.projectId],
        roleIds: [role.id],
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
      };
      const res1 = await service.search(filter);
      expect(res1.tasks).not.toContainEqual(
        expect.objectContaining({ id: task.id })
      );

      await fixtures.createRule({
        roleId: role.id,
        taskId: task.id,
        permission: RulePermission.MANAGE_TASKS,
      });
      await service.index([task], true);

      const res2 = await service.search(filter);
      expect(res2.tasks).toContainEqual(
        expect.objectContaining({ id: task.id })
      );
    });

    it("should return tasks matching name", async () => {
      const project = await fixtures.createProject();
      const task1 = await fixtures.createTask({
        name: "Dework is cold",
        projectId: project.id,
      });
      const task2 = await fixtures.createTask({
        name: "Dework is cool",
        projectId: project.id,
      });
      const task3 = await fixtures.createTask({
        name: "Something else",
        projectId: project.id,
      });
      await service.index([task1, task2, task3], true);

      const res = await service.search({
        projectIds: [project.id],
        name: "work is cool",
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
      });

      expect(res.tasks[0].id).toEqual(task2.id);
      expect(res.tasks[1].id).toEqual(task1.id);
      expect(res).not.toContainEqual(expect.objectContaining({ id: task3.id }));
    });

    describe("sorting", () => {
      let project: Project;
      let task1: Task;
      let task2: Task;
      let task3: Task;

      beforeEach(async () => {
        project = await fixtures.createProject();

        task1 = await fixtures.createTask({
          sortKey: "02",
          priority: TaskPriority.HIGH,
          doneAt: moment("2020-01-01").toDate(),
          projectId: project.id,
        });
        task2 = await fixtures.createTask({
          sortKey: "1",
          priority: TaskPriority.LOW,
          doneAt: moment("2022-01-01").toDate(),
          projectId: project.id,
        });
        task3 = await fixtures.createTask({
          sortKey: "05",
          priority: TaskPriority.URGENT,
          doneAt: moment("2021-01-01").toDate(),
          projectId: project.id,
        });

        await service.index([task1, task2, task3], true);
      });

      it("should sort by sortKey", async () => {
        const res = await service.search({
          size: 3,
          sortBy: {
            field: TaskViewSortByField.sortKey,
            direction: TaskViewSortByDirection.DESC,
          },
          projectIds: [project.id],
        });
        expect(res.tasks.map((t) => t.id)).toEqual([
          task2.id,
          task3.id,
          task1.id,
        ]);
      });

      it("should sort by createdAt", async () => {
        const res = await service.search({
          size: 3,
          sortBy: {
            field: TaskViewSortByField.createdAt,
            direction: TaskViewSortByDirection.ASC,
          },
          projectIds: [project.id],
        });
        expect(res.tasks.map((t) => t.id)).toEqual([
          task1.id,
          task2.id,
          task3.id,
        ]);
      });

      it("should sort by doneAt", async () => {
        const res = await service.search({
          size: 3,
          sortBy: {
            field: TaskViewSortByField.doneAt,
            direction: TaskViewSortByDirection.DESC,
          },
          projectIds: [project.id],
        });
        expect(res.tasks.map((t) => t.id)).toEqual([
          task2.id,
          task3.id,
          task1.id,
        ]);
      });

      it("should sort by priority", async () => {
        const res = await service.search({
          size: 3,
          sortBy: {
            field: TaskViewSortByField.priority,
            direction: TaskViewSortByDirection.ASC,
          },
          projectIds: [project.id],
        });
        expect(res.tasks.map((t) => t.id)).toEqual([
          task2.id,
          task1.id,
          task3.id,
        ]);
      });
    });

    it("should paginate correctly", async () => {
      const project = await fixtures.createProject();
      const tasks = await Bluebird.mapSeries(_.range(15), () =>
        fixtures.createTask({ projectId: project.id })
      );
      await service.index(tasks, true);

      const res1 = await service.search({
        size: 10,
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
        projectIds: [project.id],
      });

      const res2 = await service.search({
        size: 10,
        sortBy: {
          field: TaskViewSortByField.sortKey,
          direction: TaskViewSortByDirection.ASC,
        },
        projectIds: [project.id],
        cursor: res1.cursor,
      });

      expect(res1.cursor).toBeDefined();
      expect(res1.tasks.map((t) => t.id)).toEqual(
        tasks.slice(0, 10).map((t) => t.id)
      );
      expect(res2.cursor).not.toBeDefined();
      expect(res2.tasks.map((t) => t.id)).toEqual(
        tasks.slice(10, 15).map((t) => t.id)
      );
    });
  });
});
