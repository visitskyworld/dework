import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { DiscordIntegrationRequests } from "@dewo/api/testing/requests/discord.integration.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as Discord from "discord.js";
import { DiscordService } from "../discord.service";
import faker from "faker";

const discordGuildId = "915593019871342592";
const discordChannelId = "950769460501958659";

const discordUserId = "921849518750838834";
const discordUserAccessToken = "MIh53yuCgx4CNwQA5tqbIkAiaG98Gc";

describe("DiscordIntegrationResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let discord: Discord.Client;
  let client: GraphQLTestClient;
  let discordGuild: Discord.Guild;
  let discordChannel: Discord.TextChannel;
  let discordThread: Discord.ThreadChannel;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    discord = app.get(DiscordService).getClient({ config: {} } as any);
    client = app.get(GraphQLTestClient);

    discordGuild = await discord.guilds.fetch(discordGuildId);
    discordChannel = (await discordGuild.channels.fetch(discordChannelId, {
      force: true,
    })) as Discord.TextChannel;
    discordThread = (await discordChannel.threads.create({
      name: "test thread",
    })) as Discord.ThreadChannel;
  });

  afterAll(() => app.close());

  describe("Queries", () => {
    describe("getDiscordIntegrationChannels", () => {
      it("should fail if organization has no Discord integration", async () => {
        const organization = await fixtures.createOrganization();
        const response = await client.request({
          app,
          body: DiscordIntegrationRequests.getChannels(organization.id),
        });

        client.expectGqlError(response, HttpStatus.NOT_FOUND);
      });

      it("should return Discord channels for organization", async () => {
        const organization = await fixtures.createOrganization();
        const integration = await fixtures.createOrganizationIntegration({
          organizationId: organization.id,
          type: OrganizationIntegrationType.DISCORD,
          config: { guildId: discordGuildId, permissions: "" },
        });

        const response = await client.request({
          app,
          body: DiscordIntegrationRequests.getChannels(organization.id),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const channels = response.body.data?.channels;
        expect(channels).toContainEqual(
          expect.objectContaining({
            id: discordChannel.id,
            name: discordChannel.name,
            integrationId: integration.id,
          })
        );
      });

      it("should return nested Discord threads for organization", async () => {
        const organization = await fixtures.createOrganization();
        const integration = await fixtures.createOrganizationIntegration({
          organizationId: organization.id,
          type: OrganizationIntegrationType.DISCORD,
          config: { guildId: discordGuildId, permissions: "" },
        });

        const response = await client.request({
          app,
          body: DiscordIntegrationRequests.getChannels(
            organization.id,
            discordChannel.id
          ),
        });

        const channels = response.body.data?.channels;
        expect(channels).toContainEqual(
          expect.objectContaining({
            id: discordThread.id,
            name: discordThread.name,
            integrationId: integration.id,
          })
        );
      });
    });
  });

  describe("Mutations", () => {
    describe("createTaskDiscordLink", () => {
      it("should fail if task's project does not have a discord integration", async () => {
        const task = await fixtures.createTask();
        const response = await client.request({
          app,
          body: DiscordIntegrationRequests.createTaskDiscordLink(task.id),
        });

        client.expectGqlError(response, HttpStatus.NOT_FOUND);
      });

      it("should create new Discord thread if none exists", async () => {
        const { project } = await fixtures.createProjectWithDiscordIntegration(
          discordGuildId,
          discordChannelId
        );

        const task = await fixtures.createTask({ projectId: project.id });
        const linkWhenNoThreadExists = await client
          .request({
            app,
            body: DiscordIntegrationRequests.createTaskDiscordLink(task.id),
          })
          .then((res) => res.body.data.link);

        const [{}, guildId, threadId] = linkWhenNoThreadExists.match(
          /\/([0-9]+)\/([0-9]+)$/
        );

        expect(guildId).toEqual(discordGuild.id);
        const thread = (await discord.channels.fetch(threadId)) as
          | Discord.ThreadChannel
          | undefined;
        expect(thread).toBeDefined();
        expect(thread?.isThread()).toBe(true);

        const linkWhenThreadExists = await client
          .request({
            app,
            body: DiscordIntegrationRequests.createTaskDiscordLink(task.id),
          })
          .then((res) => res.body.data.link);
        expect(linkWhenThreadExists).toEqual(linkWhenNoThreadExists);

        await thread?.setArchived(true);
        const linkAfterThreadArchived = await client
          .request({
            app,
            body: DiscordIntegrationRequests.createTaskDiscordLink(task.id),
          })
          .then((res) => res.body.data.link);
        expect(linkAfterThreadArchived).toEqual(linkWhenNoThreadExists);
        const updatedThread = (await discord.channels.fetch(threadId, {
          force: true,
        })) as Discord.ThreadChannel | undefined;
        expect(updatedThread?.archived).toEqual(false);

        await thread?.delete();
        const linkAfterThreadDeleted = await client
          .request({
            app,
            body: DiscordIntegrationRequests.createTaskDiscordLink(task.id),
          })
          .then((res) => res.body.data.link);
        expect(linkAfterThreadDeleted).not.toEqual(linkWhenNoThreadExists);
      });
    });

    xdescribe("addUserToDiscordGuild", () => {
      it("should fail if org has no discord integration", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: DiscordIntegrationRequests.addUserToDiscordGuild(
            organization.id
          ),
        });

        client.expectGqlError(response, HttpStatus.NOT_FOUND);
        client.expectGqlErrorMessage(
          response,
          "Organization integration not found"
        );
      });

      it("should fail if user has not authed with discord", async () => {
        const { organization } =
          await fixtures.createProjectWithDiscordIntegration(
            discordGuildId,
            discordChannelId
          );
        const user = await fixtures.createUser();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: DiscordIntegrationRequests.addUserToDiscordGuild(
            organization.id
          ),
        });

        client.expectGqlError(response, HttpStatus.NOT_FOUND);
        client.expectGqlErrorMessage(
          response,
          "User has no connected Discord account"
        );
      });

      it("should add user to Discord guild", async () => {
        // Dework role in discord was manually given the "Kick Members" permission to get the unit test to work
        await discordGuild.members.kick(discordUserId).catch();
        const memberBefore = await discordGuild.members
          .fetch(discordUserId)
          .catch(() => undefined);
        expect(memberBefore).toBeFalsy();

        const { organization } =
          await fixtures.createProjectWithDiscordIntegration(
            discordGuildId,
            discordChannelId
          );
        const user = await fixtures.createUser({
          source: ThreepidSource.discord,
          threepid: discordUserId,
          config: {
            accessToken: discordUserAccessToken,
            profile: { username: faker.internet.userName() },
          } as any,
        });
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: DiscordIntegrationRequests.addUserToDiscordGuild(
            organization.id
          ),
        });

        expect(response.body.data.added).toEqual(true);

        const memberAfter = await discordGuild.members.fetch(discordUserId);
        expect(memberAfter).toBeFalsy();
      });
    });
  });
});
