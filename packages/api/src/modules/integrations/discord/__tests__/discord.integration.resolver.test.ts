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
  let discordChannel: Discord.TextChannel;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    discord = app.get(DiscordService).client;
    client = app.get(GraphQLTestClient);

    const guild = await discord.guilds.fetch(discordGuildId);
    discordChannel = (await guild.channels.fetch(discordChannelId, {
      force: true,
    })) as Discord.TextChannel;
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
    });
  });
});
