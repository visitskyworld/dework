import { Project, ProjectVisibility } from "@dewo/api/models/Project";
import { TaskStatus } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import faker from "faker";
import moment from "moment";
import { Coordinape } from "../coordinape.types";

describe("CoordinapeController", () => {
  describe("integrations/coordinape", () => {
    let app: INestApplication;
    let fixtures: Fixtures;
    let project: Project;
    const doneAtAfter = new Date(0);
    const doneAt = new Date(1000);
    const doneAtBefore = new Date(2000);

    beforeAll(async () => {
      app = await getTestApp();
      fixtures = app.get(Fixtures);
    });

    beforeEach(async () => {
      project = await fixtures.createProject();
    });

    const req = (): Promise<Coordinape.Response> =>
      supertest(app.getHttpServer())
        .get(`/integrations/coordinape/${project.id}`)
        .query({
          epoch_start: moment(doneAtAfter).unix(),
          epoch_end: moment(doneAtBefore).unix(),
        })
        .send()
        .then((res) => res.body);

    it("should return task completed within given date range", async () => {
      const address1 = `0x${faker.datatype.number()}`;
      const address2 = `0x${faker.datatype.number()}`;
      const assignee1 = await fixtures.createUser({
        source: ThreepidSource.metamask,
        threepid: address1,
      });
      const assignee2 = await fixtures.createUser({
        source: ThreepidSource.metamask,
        threepid: address2,
      });
      const task = await fixtures.createTask({
        status: TaskStatus.DONE,
        doneAt,
        assignees: [assignee1, assignee2],
        projectId: project.id,
      });

      const res = await req();
      expect(res.users).toContainEqual(
        expect.objectContaining({
          address: address1,
          contributions: expect.arrayContaining([
            expect.objectContaining({ title: task.name }),
          ]),
        })
      );
      expect(res.users).toContainEqual(
        expect.objectContaining({
          address: address2,
          contributions: expect.arrayContaining([
            expect.objectContaining({ title: task.name }),
          ]),
        })
      );
    });

    it("should not return task completed by user without address", async () => {
      const user = await fixtures.createUser();
      await fixtures.createTask({
        status: TaskStatus.DONE,
        doneAt,
        assignees: [user],
        projectId: project.id,
      });

      const res = await req();
      expect(res.users).toEqual([]);
    });

    it("should not return unassigned task", async () => {
      await fixtures.createTask({
        status: TaskStatus.DONE,
        doneAt,
        projectId: project.id,
      });

      const res = await req();
      expect(res.users).toEqual([]);
    });

    it("should not return uncompleted task", async () => {
      await fixtures.createTask({
        status: TaskStatus.TODO,
        projectId: project.id,
      });

      const res = await req();
      expect(res.users).toEqual([]);
    });

    it("should not return tasks completed before or after date range", async () => {
      const user = await fixtures.createUser({
        source: ThreepidSource.metamask,
        threepid: `0x${faker.datatype.number()}`,
      });
      await fixtures.createTask({
        status: TaskStatus.DONE,
        assignees: [user],
        doneAt: moment(doneAtAfter).subtract(1, "second").toDate(),
        projectId: project.id,
      });
      await fixtures.createTask({
        status: TaskStatus.DONE,
        assignees: [user],
        doneAt: moment(doneAtBefore).add(1, "second").toDate(),
        projectId: project.id,
      });

      const res = await req();
      expect(res.users).toEqual([]);
    });

    it("should not return tasks from private project", async () => {
      project = await fixtures.createProject({
        visibility: ProjectVisibility.PRIVATE,
      });
      await fixtures.createTask({
        status: TaskStatus.DONE,
        doneAt,
        assignees: [await fixtures.createUser()],
        projectId: project.id,
      });

      const res = await req();
      expect(res.error).toEqual("Forbidden resource");
    });
  });
});
