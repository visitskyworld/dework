import {
  DiscordProjectIntegrationConfig,
  ProjectIntegrationSource,
} from "@dewo/api/models/ProjectIntegration";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { TaskRequests } from "@dewo/api/testing/requests/task.requests";
import { INestApplication } from "@nestjs/common";
import { DiscordIntegrationService } from "../discord.integration.service";

describe("DiscordIntegration", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;
  let discordService: DiscordIntegrationService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
    discordService = app.get(DiscordIntegrationService);
  });

  afterAll(() => app.close());

  describe("create Discord channel on task creation", () => {
    it("should not create Discord channel if project has no Discord integration", async () => {
      const project = await fixtures.createProject();
      const task = await fixtures.createTask({ projectId: project.id });

      const fetched = await client
        .request({ app, body: TaskRequests.get(task.id) })
        .then((res) => res.body.data.task);
      expect(fetched.discordChannel).toBe(null);
    });

    it("should create Discord channel if project has Discord integration", async () => {
      const project = await fixtures.createProject();
      await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.discord,
        config: {
          features: [],
          guildId: "915593019871342592",
          permissions: "",
        } as DiscordProjectIntegrationConfig,
      });
      const task = await fixtures.createTask({ projectId: project.id });

      const fetched = await client
        .request({ app, body: TaskRequests.get(task.id) })
        .then((res) => res.body.data.task);
      expect(fetched.discordChannel).not.toBe(null);
    });

    xit("should add task owner to Discord channel", async () => {});

    xit("should add updated task owner to Discord channel on change", async () => {});

    xit("should send msg to archive channel when task is moved to done", async () => {});
  });

  describe("DiscordIntegrationService", () => {
    describe("findTaskUserThreepids", () => {
      it("should include owner and task assignees that have threepids", async () => {
        const owner = await fixtures.createUser({
          source: ThreepidSource.discord,
        });
        const creator = await fixtures.createUser({
          source: ThreepidSource.discord,
        });
        const assigneeWithDiscord = await fixtures.createUser({
          source: ThreepidSource.discord,
        });
        const assigneeWithoutDiscord = await fixtures.createUser({
          source: ThreepidSource.github,
        });

        const task = await fixtures.createTask({
          ownerId: owner.id,
          creatorId: creator.id,
          assignees: [assigneeWithDiscord, assigneeWithoutDiscord],
        });

        const threepids = await discordService.findTaskUserThreepids(task);
        expect(threepids).toContainEqual(
          expect.objectContaining({ userId: owner.id })
        );
        expect(threepids).toContainEqual(
          expect.objectContaining({ userId: assigneeWithDiscord.id })
        );

        expect(threepids).not.toContainEqual(
          expect.objectContaining({ userId: creator.id })
        );
        expect(threepids).not.toContainEqual(
          expect.objectContaining({ userId: assigneeWithoutDiscord.id })
        );
      });
    });
  });
});
