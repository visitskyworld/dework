import {
  DiscordProjectIntegrationConfig,
  ProjectIntegrationSource,
} from "@dewo/api/models/ProjectIntegration";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { DiscordIntegrationService } from "../discord.integration.service";
import * as Discord from "discord.js";
import { DiscordService } from "../discord.service";
import { Task } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { TaskService } from "@dewo/api/modules/task/task.service";

const discordGuildId = "915593019871342592";
const discordUserId = "921849518750838834";

describe("DiscordIntegration", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let discord: Discord.Client;
  let taskService: TaskService;
  let discordIntegrationService: DiscordIntegrationService;
  let user: User;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    discord = app.get(DiscordService).client;
    taskService = app.get(TaskService);
    discordIntegrationService = app.get(DiscordIntegrationService);

    user = await fixtures.createUser({
      source: ThreepidSource.discord,
      threepid: discordUserId,
    });
  });

  afterAll(() => app.close());

  describe("create Discord channel on task creation", () => {
    async function createProjectWithDiscordIntegration() {
      const project = await fixtures.createProject();
      await fixtures.createProjectIntegation({
        projectId: project.id,
        source: ProjectIntegrationSource.discord,
        config: {
          features: [],
          guildId: discordGuildId,
          permissions: "",
        } as DiscordProjectIntegrationConfig,
      });
      return project;
    }

    async function getDiscordChannelPermission(task: Task) {
      const discordChannel = await task.discordChannel;
      if (!discordChannel) return null;
      const channel = (await discord.channels.fetch(
        discordChannel.channelId
      )) as Discord.TextChannel;
      return channel.permissionsFor(discordUserId);
    }

    it("should not create Discord channel if project has no Discord integration", async () => {
      const project = await fixtures.createProject();
      const task = await fixtures.createTask({ projectId: project.id });
      expect(task.discordChannel).resolves.toBe(null);
    });

    it("should create Discord channel if project has Discord integration", async () => {
      const project = await createProjectWithDiscordIntegration();
      const task = await fixtures.createTask({ projectId: project.id });
      expect(task.discordChannel).resolves.not.toBe(null);
    });

    it("should not give unrelated user Discord channel access", async () => {
      const project = await createProjectWithDiscordIntegration();
      const task = await fixtures.createTask({ projectId: project.id });

      const permission = await getDiscordChannelPermission(task);
      expect(permission).toBe(null);
    });

    it("should add task owner to Discord channel", async () => {
      const project = await createProjectWithDiscordIntegration();
      const task = await fixtures.createTask({
        projectId: project.id,
        ownerId: user.id,
      });

      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("VIEW_CHANNEL")).toBe(true);
    });

    it("should add task assignees to Discord channel", async () => {
      const project = await createProjectWithDiscordIntegration();
      const task = await fixtures.createTask({
        projectId: project.id,
        assignees: [user],
      });

      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("VIEW_CHANNEL")).toBe(true);
    });

    it("should add updated task owner to Discord channel on change", async () => {
      const project = await createProjectWithDiscordIntegration();
      const task = await fixtures.createTask({ projectId: project.id });
      expect(getDiscordChannelPermission(task)).resolves.toBe(null);

      await taskService.update({ id: task.id, assignees: [user] });
      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("VIEW_CHANNEL")).toBe(true);
    });

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

        const threepids = await discordIntegrationService.findTaskUserThreepids(
          task
        );
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
