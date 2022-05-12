import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { Task } from "@dewo/api/models/Task";
import { TaskApplication } from "@dewo/api/models/TaskApplication";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import * as Discord from "discord.js";
import _ from "lodash";
import { DiscordService } from "../../discord.service";
import { DiscordTaskApplicationService } from "../discord.taskApplication.service";

const discordGuildId = "915593019871342592";
const discordUserId = "921849518750838834";

describe("DiscordTaskApplicationService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let discord: Discord.Client;
  let user: User;
  let discordGuild: Discord.Guild;
  let service: DiscordTaskApplicationService;
  let task: Task;
  let application: TaskApplication;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    discord = app.get(DiscordService).getClient({ config: {} } as any);
    service = app.get(DiscordTaskApplicationService);

    user = await fixtures.createUser({
      source: ThreepidSource.discord,
      threepid: discordUserId,
    });

    discordGuild = await discord.guilds.fetch({
      guild: discordGuildId,
      force: true,
    });

    await discordGuild.roles.fetch();

    const botPermissions = await discordGuild.members
      .fetch(app.get(DiscordService).getBotUserId({ config: {} } as any))
      .then((m) => m.permissions);
    console.log("Bot permissions in guild: ", {
      botPermissions,
      privateThreads: discordGuild.features.includes("PRIVATE_THREADS"),
    });
  });

  beforeEach(async () => {
    const organization = await fixtures.createOrganization();
    await fixtures.createOrganizationIntegration({
      organizationId: organization.id,
      type: OrganizationIntegrationType.DISCORD,
      config: { guildId: discordGuildId, permissions: "" },
    });

    const project = await fixtures.createProject({
      organizationId: organization.id,
    });
    task = await fixtures.createTask({
      owners: [user],
      projectId: project.id,
    });
    application = await fixtures.createTaskApplication({
      userId: user.id,
      taskId: task.id,
    });
  });

  afterAll(() => app.close());

  async function getDiscordChannelAndThread(): Promise<{
    channel: Discord.TextChannel;
    thread: Discord.ThreadChannel;
  }> {
    const channel = await discordGuild.channels
      .fetch()
      .then((channels) =>
        channels.find(
          (c): c is Discord.TextChannel =>
            c.name === "dework-task-applicants" && c.isText()
        )
      );
    await discordGuild.roles.fetch(undefined, { force: true, cache: true });

    if (!channel) throw new Error("#dework-task-applicants not found");

    const thread = await channel?.threads.fetch().then(
      (t) =>
        _.sortBy(
          t.threads.map((t) => t),
          (t) => t.createdAt
        ).reverse()[0]
    );

    return { channel, thread };
  }

  describe("createTaskApplicationThread", () => {
    it("should create public thread in private channel", async () => {
      // createTaskApplicationThread should get called as part of TaskApplication.create
      const { channel, thread } = await getDiscordChannelAndThread();

      expect(channel).toBeDefined();
      expect(channel?.permissionsFor(discordUserId)?.has("VIEW_CHANNEL")).toBe(
        true
      );
      expect(
        channel?.permissionsFor(discordGuild.id)?.has("VIEW_CHANNEL")
      ).toBe(false);

      expect(thread.name).toContain(task.name);
      expect(thread.name).toContain(user.username);
      expect(thread.permissionsFor(discordUserId)?.has("VIEW_CHANNEL")).toBe(
        true
      );

      const updatedTask = await fixtures.getTask(task.id);
      const updatedApplication = (await updatedTask?.applications)?.find(
        (a) => a.id === application.id
      );
      expect(updatedApplication?.discordThreadUrl).toBe(
        `https://discord.com/channels/${discordGuild.id}/${thread.id}`
      );
    });
  });

  describe("deleteTaskApplicationThread", () => {
    it("should delete thread when task application is deleted", async () => {
      const before = await getDiscordChannelAndThread();
      expect(before.thread.archived).toBe(false);
      expect(application.discordThreadUrl).toBe(
        `https://discord.com/channels/${discordGuild.id}/${before.thread.id}`
      );

      await service.deleteTaskApplicationThread(application, task);
      const threadAfter = await before.channel.threads.fetch(before.thread.id);
      expect(threadAfter?.archived).toBe(true);
    });
  });
});
