import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { DiscordRolesService } from "../discord.roles.service";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import { Organization } from "@dewo/api/models/Organization";
import { RoleSource } from "@dewo/api/models/rbac/Role";
import { ThreepidSource } from "@dewo/api/models/Threepid";

const discordGuildId = "915593019871342592";
const discordUserId = "921849518750838834";

describe("DiscordRolesService", () => {
  let app: INestApplication;
  let service: DiscordRolesService;
  let fixtures: Fixtures;

  beforeAll(async () => {
    app = await getTestApp();
    service = app.get(DiscordRolesService);
    fixtures = app.get(Fixtures);
  });

  afterAll(() => app.close());

  describe("syncRoles", () => {
    let organization: Organization;
    let integration: OrganizationIntegration<OrganizationIntegrationType.DISCORD>;

    beforeEach(async () => {
      organization = await fixtures.createOrganization();
      integration = await fixtures.createOrganizationIntegration({
        organizationId: organization.id,
        type: OrganizationIntegrationType.DISCORD,
        config: { guildId: discordGuildId, permissions: "" },
      });
    });

    describe("roles", () => {
      it("should store correct discord roles", async () => {
        await service.syncRoles(integration);
        const roles = await organization.roles;

        expect(roles).toContainEqual(
          expect.objectContaining({
            name: "@everyone",
            color: "grey",
            fallback: true,
            source: RoleSource.DISCORD,
            externalId: discordGuildId,
            organizationId: organization.id,
          })
        );
        expect(roles).toContainEqual(
          expect.objectContaining({
            name: "discord-tester-role",
            color: "orange",
            fallback: false,
            organizationId: organization.id,
          })
        );
      });

      it("should not import Dework bot roles", async () => {
        await service.syncRoles(integration);
        const roles = await organization.roles;

        expect(roles).not.toContainEqual(
          expect.objectContaining({ name: "Dework" })
        );
        expect(roles).not.toContainEqual(
          expect.objectContaining({ name: "Dework Dev" })
        );
        expect(roles).not.toContainEqual(
          expect.objectContaining({ name: "Dework Demo" })
        );
      });

      it("should not create new roles when scraping again", async () => {
        await service.syncRoles(integration);
        const roles1 = await fixtures
          .getOrganization(organization.id)
          .then((o) => o?.roles);

        const updatedIntegration = (await fixtures.getOrganizationIntegration(
          integration.id
        )) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
        await service.syncRoles(updatedIntegration);
        const roles2 = await fixtures
          .getOrganization(organization.id)
          .then((o) => o?.roles);

        expect(roles1).toEqual(roles2);
      });

      it("should delete existing Discord roles", async () => {
        const roleConnectedWithDiscord = await fixtures.createRole({
          organizationId: organization.id,
          source: RoleSource.DISCORD,
          externalId: Date.now().toString(),
        });
        const customRole = await fixtures.createRole({
          organizationId: organization.id,
        });
        await service.syncRoles(integration);
        const roles = await organization.roles;

        expect(roles).not.toContainEqual(
          expect.objectContaining({ id: roleConnectedWithDiscord.id })
        );
        expect(roles).toContainEqual(
          expect.objectContaining({ id: customRole.id })
        );
      });
    });

    describe("user/role mapping", () => {
      it("should sadd user/role mapping", async () => {
        const user = await fixtures.createUser({
          source: ThreepidSource.discord,
          threepid: discordUserId,
        });

        await service.syncRoles(integration);
        const roles = await user.roles;
        expect(roles).toContainEqual(
          expect.objectContaining({
            name: "@everyone",
            organizationId: organization.id,
          })
        );
        expect(roles).toContainEqual(
          expect.objectContaining({
            name: "discord-tester-role",
            organizationId: organization.id,
          })
        );
      });

      it("should remove user/role mapping (but not fallback role mapping)", async () => {
        await service.syncRoles(integration);
        const roles = await organization.roles;
        const fallbackRole = roles.find((r) => r.fallback);
        const discordRole = roles.find(
          (r) => !r.fallback && r.source === RoleSource.DISCORD
        );

        const user = await fixtures.createUser();
        await fixtures.addRole(user.id, fallbackRole!.id);
        await fixtures.addRole(user.id, discordRole!.id);

        const userRolesBefore = await fixtures
          .getUser(user.id)
          .then((u) => u!.roles);
        expect(userRolesBefore).toContainEqual(
          expect.objectContaining(fallbackRole)
        );
        expect(userRolesBefore).toContainEqual(
          expect.objectContaining(discordRole)
        );

        const updatedIntegration = (await fixtures.getOrganizationIntegration(
          integration.id
        )) as OrganizationIntegration<OrganizationIntegrationType.DISCORD>;
        await service.syncRoles(updatedIntegration);

        const userRolesAfter = await fixtures
          .getUser(user.id)
          .then((u) => u!.roles);
        expect(userRolesAfter).toContainEqual(
          expect.objectContaining(fallbackRole)
        );
        expect(userRolesAfter).not.toContainEqual(
          expect.objectContaining(discordRole)
        );
      });
    });
  });
});
