import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { DiscordRolesRequests } from "@dewo/api/testing/requests/discord.roles.requests";
import { INestApplication } from "@nestjs/common";

describe("DiscordRolesResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("updateOrganizationDiscordRoles", () => {
    it("should fail if org has no discord integration", async () => {
      const organization = await fixtures.createOrganization();
      const user = await fixtures.createUser();

      const response = await client.request({
        app,
        auth: fixtures.createAuthToken(user),
        body: DiscordRolesRequests.updateOrganizationDiscordRoles(
          organization.id
        ),
      });

      client.expectGqlErrorMessage(
        response,
        "Must have Discord integration to refresh Discord roles."
      );
    });
  });
});
