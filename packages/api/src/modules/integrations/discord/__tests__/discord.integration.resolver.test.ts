import { OrganizationIntegrationType } from "@dewo/api/models/OrganizationIntegration";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { DiscordIntegrationRequests } from "@dewo/api/testing/requests/discord.integration.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as Discord from "discord.js";
import { DiscordService } from "../discord.service";

const discordGuildId = "915593019871342592";
const discordChannelId = "926823781102661652";

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
    discord = app.get(DiscordService).client;
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
        client.expectGqlErrorMessage(response, "Project integration not found");
      });

      it("should create new Discord thread if none exists", async () => {
        const project = await fixtures.createProjectWithDiscordIntegration(
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
  });
});
