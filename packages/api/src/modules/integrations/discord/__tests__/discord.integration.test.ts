import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { DiscordIntegrationService } from "../discord.integration.service";
import * as Discord from "discord.js";
import { DiscordService } from "../discord.service";
import { Task, TaskStatus } from "@dewo/api/models/Task";
import { User } from "@dewo/api/models/User";
import { TaskService } from "@dewo/api/modules/task/task.service";
import { DeepPartial } from "typeorm";
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from "@dewo/api/modules/task/task.events";

const discordGuildId = "915593019871342592";
const discordUserId = "921849518750838834";
const discordChannelId = "950769460501958659";

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
    discord = app.get(DiscordService).getClient({ config: {} } as any);
    taskService = app.get(TaskService);
    discordIntegrationService = app.get(DiscordIntegrationService);

    user = await fixtures.createUser({
      source: ThreepidSource.discord,
      threepid: discordUserId,
    });
  });

  afterAll(() => app.close());

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterEach(async () => {
    // Creating a Discord channel seems to be subject to a pretty strict rate limit, causing very long delays.
    // Waiting just 10s seems to let tests run without much delay.
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });

  function hasViewAccess(perms: Discord.Permissions | null) {
    return !!perms?.has("VIEW_CHANNEL");
  }

  async function getDiscordChannelPermission(task: Task) {
    const discordChannel = await task.discordChannel;
    if (!discordChannel) return null;
    const channel = (await discord.channels.fetch(discordChannel.channelId, {
      force: true,
    })) as Discord.TextChannel;
    return channel.permissionsFor(discordUserId);
  }

  async function createTask(
    partial: DeepPartial<Omit<Task, "rewards">>
  ): Promise<Task> {
    const task = await fixtures.createTask({
      status: TaskStatus.IN_PROGRESS,
      ...partial,
    });
    await discordIntegrationService.handle(new TaskCreatedEvent(task));
    return taskService.findById(task.id) as Promise<Task>;
  }

  async function updateTask(
    task: Task,
    partial: DeepPartial<Omit<Task, "rewards">>
  ): Promise<Task> {
    const updated = await taskService.update({ id: task.id, ...partial });
    await discordIntegrationService.handle(new TaskUpdatedEvent(updated, task));
    return taskService.findById(task.id) as Promise<Task>;
  }

  async function deleteTask(task: Task): Promise<Task> {
    const updated = await taskService.update({
      id: task.id,
      deletedAt: new Date().toISOString(),
    });
    await discordIntegrationService.handle(new TaskDeletedEvent(updated, task));
    return taskService.findById(task.id) as Promise<Task>;
  }

  describe("create task", () => {
    it("should not create Discord channel if project has no Discord integration", async () => {
      const project = await fixtures.createProject();
      const task = await createTask({ projectId: project.id });
      await expect(task.discordChannel).resolves.toBe(null);
    });

    it("should not create Discord channel if not matching requirements", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const todoTask = await createTask({
        projectId: project.id,
        status: TaskStatus.TODO,
        assignees: [],
      });
      const doneTask = await createTask({
        projectId: project.id,
        status: TaskStatus.DONE,
        assignees: [],
      });
      await expect(todoTask.discordChannel).resolves.toBe(null);
      await expect(doneTask.discordChannel).resolves.toBe(null);
    });

    it("should create Discord channel if matching requirements", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const taskWithAssignees = await createTask({
        projectId: project.id,
        assignees: [user],
      });
      // const taskWithApplications = await createTask({
      //   projectId: project.id,
      //   // applications: [], // TODO(fant)
      // });
      const taskInProgress = await createTask({
        projectId: project.id,
        status: TaskStatus.IN_PROGRESS,
      });
      const taskInReview = await createTask({
        projectId: project.id,
        status: TaskStatus.IN_REVIEW,
      });
      await expect(taskWithAssignees.discordChannel).resolves.not.toBe(null);
      // await expect(taskWithApplications.discordChannel).resolves.not.toBe(null);
      await expect(taskInProgress.discordChannel).resolves.not.toBe(null);
      await expect(taskInReview.discordChannel).resolves.not.toBe(null);
    });

    xit("should not give unrelated user Discord channel access", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({ projectId: project.id });

      const permission = await getDiscordChannelPermission(task);
      expect(hasViewAccess(permission)).toBe(false);
    });

    it("should add task owner to Discord channel", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({ projectId: project.id, owners: [user] });

      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("SEND_MESSAGES")).toBe(true);
    });

    it("should add task assignees to Discord channel", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({
        projectId: project.id,
        assignees: [user],
      });

      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("SEND_MESSAGES")).toBe(true);
    });
  });

  describe("update task", () => {
    it("should create Discord channel if task is no longer TODO", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({
        projectId: project.id,
        status: TaskStatus.TODO,
      });
      await expect(task.discordChannel).resolves.toBe(null);

      const updated = await updateTask(task, {
        status: TaskStatus.IN_PROGRESS,
      });
      await expect(updated.discordChannel).resolves.not.toBe(null);
    });

    it("should add new task owner to Discord channel", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({ projectId: project.id });
      // await getDiscordChannelPermission(task).then((perms) =>
      //   expect(hasViewAccess(perms)).toBe(false)
      // );

      await updateTask(task, { owners: [user] });
      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("SEND_MESSAGES")).toBe(true);
    });

    it("should add new task assignee to Discord channel", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({ projectId: project.id });
      // await getDiscordChannelPermission(task).then((perms) =>
      //   expect(hasViewAccess(perms)).toBe(false)
      // );

      await updateTask(task, { assignees: [user] });
      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("SEND_MESSAGES")).toBe(true);
    });

    it("should not remove old owner access to Discord channel", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({
        projectId: project.id,
        owners: [user],
      });

      const otherOwner = await fixtures.createUser({
        source: ThreepidSource.github,
      });
      await updateTask(task, { owners: [otherOwner] });
      const permission = await getDiscordChannelPermission(task);
      expect(permission).not.toBe(null);
      expect(permission!.has("SEND_MESSAGES")).toBe(true);
    });

    xit("should set internal DiscordChannel.deletedAt if channel has been deleted", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({ projectId: project.id });
      const discordChannel = await task.discordChannel;

      const guild = await discord.guilds.fetch(discordGuildId);
      const parentChannel = (await guild.channels.fetch(
        discordChannelId
      )) as Discord.TextChannel;
      const thread = await parentChannel.threads.fetch(
        discordChannel!.channelId
      );
      await thread?.delete();

      const updated = await updateTask(task, { name: "deleted" });
      const updatedDiscordChannel = await updated.discordChannel;
      expect(updatedDiscordChannel).not.toBe(null);
    });

    it("should make Discord channel archived if status is done", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({
        projectId: project.id,
        status: TaskStatus.IN_PROGRESS,
      });

      const updated = await updateTask(task, { status: TaskStatus.DONE });
      const discordChannel = await updated.discordChannel;
      const guild = await discord.guilds.fetch(discordGuildId);
      const parentChannel = await guild.channels.fetch(discordChannelId);

      const channel = await (
        parentChannel as Discord.TextChannel
      ).threads.fetch(discordChannel!.channelId);
      expect(channel?.archived).toBe(true);
    });
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
          owners: [owner],
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

  describe("delete task", () => {
    it("should archive Discord channel", async () => {
      const { project } = await fixtures.createProjectWithDiscordIntegration(
        discordGuildId,
        discordChannelId
      );
      const task = await createTask({ projectId: project.id });
      await deleteTask(task);

      const discordChannel = await task.discordChannel;
      const guild = await discord.guilds.fetch(discordGuildId);
      const parentChannel = await guild.channels.fetch(discordChannelId);
      const channel = await (
        parentChannel as Discord.TextChannel
      ).threads.fetch(discordChannel!.channelId);

      expect(channel?.archived).toBe(true);
    });
  });
});
