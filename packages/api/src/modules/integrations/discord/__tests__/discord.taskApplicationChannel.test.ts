import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import * as Discord from "discord.js";
import _ from "lodash";
import { DiscordService } from "../discord.service";
import { DiscordTaskApplicationThreadService } from "../discord.taskApplicationChannel";

const discordGuildId = "915593019871342592";
const discordUserId = "921849518750838834";

describe("DiscordTaskApplicationThreadService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let discord: Discord.Client;
  let user: User;
  let discordGuild: Discord.Guild;
  let service: DiscordTaskApplicationThreadService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    discord = app.get(DiscordService).getClient({ config: {} } as any);
    service = app.get(DiscordTaskApplicationThreadService);

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

  afterAll(() => app.close());

  afterEach(async () => {
    // Creating a Discord channel seems to be subject to a pretty strict rate limit, causing very long delays.
    // Waiting just 10s seems to let tests run without much delay.
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });

  describe("createTaskApplicationThread", () => {
    // describe('noop', () => {
    //   it("should not do anything if task has no owner", async () => {});
    //   it("should not do anything if task org has no discord integration", async () => {});
    //   it("should not do anything if applicant and owner have not connected Discord", async () => {});
    // });

    describe("success", () => {
      // it("should create private channel if not exists", async () => {});
      // it("should reuse private channel if exists", async () => {});

      it("should create private thread in private channel", async () => {
        const organization = await fixtures.createOrganization();
        await fixtures.createOrganizationIntegration({
          organizationId: organization.id,
          type: OrganizationIntegrationType.DISCORD,
          config: { guildId: discordGuildId, permissions: "" },
        });

        const project = await fixtures.createProject({
          organizationId: organization.id,
        });
        const task = await fixtures.createTask({
          ownerId: user.id,
          projectId: project.id,
        });
        const application = await fixtures.createTaskApplication({
          userId: user.id,
          taskId: task.id,
        });

        await service.createTaskApplicationThread(application);
        const channel = await discordGuild.channels
          .fetch()
          .then((channels) =>
            channels.find(
              (c): c is Discord.TextChannel =>
                c.name === "dework-task-applicants" && c.isText()
            )
          );
        await discordGuild.roles.fetch(undefined, { force: true, cache: true });

        expect(channel).toBeDefined();
        expect(
          channel?.permissionsFor(discordUserId)?.has("VIEW_CHANNEL")
        ).toBe(true);
        expect(
          channel?.permissionsFor(discordGuild.id)?.has("VIEW_CHANNEL")
        ).toBe(false);

        const latestThread = await channel!.threads.fetch().then(
          (t) =>
            _.sortBy(
              t.threads.map((t) => t),
              (t) => t.createdAt
            ).reverse()[0]
        );
        expect(latestThread.name).toContain(task.name);
        expect(latestThread.name).toContain(user.username);
        expect(
          latestThread.permissionsFor(discordUserId)?.has("VIEW_CHANNEL")
        ).toBe(true);
      });
    });
  });
});
