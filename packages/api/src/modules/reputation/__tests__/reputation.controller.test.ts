import { TaskStatus } from "@dewo/api/models/Task";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { Reputation } from "../reputation.types";

describe("ReputationController", () => {
  describe("v1/reputation/:address", () => {
    let app: INestApplication;
    let fixtures: Fixtures;

    beforeAll(async () => {
      app = await getTestApp();
      fixtures = app.get(Fixtures);
    });

    const req = (address: string): Promise<Reputation.Response> =>
      supertest(app.getHttpServer())
        .get(`/v1/reputation/${address}`)
        .send()
        .then((res) => res.body);

    it("should return done tasks", async () => {
      const address = fixtures.address();
      const user = await fixtures.createUser({
        source: ThreepidSource.metamask,
        threepid: address,
      });

      const tag = await fixtures.createTaskTag();
      const organization = await fixtures.createOrganization();
      const project = await fixtures.createProject({
        organizationId: organization.id,
      });
      const doneTask = await fixtures.createTask({
        status: TaskStatus.DONE,
        assignees: [user],
        storyPoints: 123,
        reward: {},
        doneAt: new Date(),
        tags: [tag],
        projectId: project.id,
      });
      const doneReward = (await doneTask.reward)!;

      const todoTask = await fixtures.createTask({
        assignees: [user],
        status: TaskStatus.TODO,
        projectId: project.id,
      });

      const res = await req(address.toLowerCase());
      expect(res.address).toEqual(address);
      expect(res.tasks).toContainEqual(
        expect.objectContaining({
          name: doneTask.name,
          date: doneTask.doneAt?.toISOString(),
          points: doneTask.storyPoints,
          tags: [{ label: tag.label }],
          reward: expect.objectContaining({
            amount: doneReward.amount,
            token: expect.objectContaining({
              address: (await doneReward.token).address,
              network: expect.objectContaining({
                slug: (await (await doneReward.token).network).slug,
              }),
            }),
          }),
          project: expect.objectContaining({
            name: project.name,
            organization: expect.objectContaining({ name: organization.name }),
          }),
        })
      );
      expect(res.tasks).not.toContainEqual(
        expect.objectContaining({
          name: todoTask.name,
        })
      );
    });
  });
});
