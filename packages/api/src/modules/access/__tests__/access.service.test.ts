import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Organization } from "@dewo/api/models/Organization";
import {
  OrganizationIntegration,
  OrganizationIntegrationType,
} from "@dewo/api/models/OrganizationIntegration";
import {
  AccessControlOp,
  AccessControlType,
  DiscordRoleAccessControl,
} from "@dewo/api/models/AccessControl";
import { AccessService } from "../access.service";
import { User } from "@dewo/api/models/User";
import _ from "lodash";

const discordGuildId = "915593019871342592";
const discordUserId = "921849518750838834";
const discordEveryoneRoleId = discordGuildId;
const discordUnknownRoleId = Date.now().toString();

describe("AccessService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let service: AccessService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    service = app.get(AccessService);
  });

  afterAll(() => app.close());

  describe("test", () => {
    let user: User;
    let organizationWithDiscordIntegration: Organization;
    let organizationDiscordIntegration: OrganizationIntegration;
    let matchingDiscordAccessControl: DiscordRoleAccessControl;
    let notMatchingDiscordAccessControl: DiscordRoleAccessControl;

    beforeAll(async () => {
      user = await fixtures.createUser({
        source: ThreepidSource.discord,
        threepid: discordUserId,
      });

      organizationWithDiscordIntegration = await fixtures.createOrganization();
      organizationDiscordIntegration =
        await fixtures.createOrganizationIntegration({
          organizationId: organizationWithDiscordIntegration.id,
          type: OrganizationIntegrationType.DISCORD,
          config: { guildId: discordGuildId, permissions: "" },
        });

      matchingDiscordAccessControl = await fixtures.createAccessControl(
        AccessControlType.DISCORD_ROLE,
        // @everyone role
        {
          roleId: discordGuildId,
          integrationId: organizationDiscordIntegration.id,
        }
      );

      notMatchingDiscordAccessControl = await fixtures.createAccessControl(
        AccessControlType.DISCORD_ROLE,
        { roleId: "-1", integrationId: organizationDiscordIntegration.id }
      );
    });

    describe("DiscordRoleAccessControl", () => {
      it("should return true if has matching Discord role", async () => {
        const test = await service.test(matchingDiscordAccessControl, user.id);
        expect(test).toEqual(true);
      });

      it("should return false if has no Discord connection", async () => {
        const user = await fixtures.createUser();
        const test = await service.test(matchingDiscordAccessControl, user.id);
        expect(test).toEqual(false);
      });

      it("should return false if does not have Discord role in guild", async () => {
        const test = await service.test(
          notMatchingDiscordAccessControl,
          user.id
        );
        expect(test).toEqual(false);
      });
    });

    describe("OpAccessControl", () => {
      const create = async (
        op: AccessControlOp,
        numTrue: number,
        numTotal: number
      ) => {
        const parent = await fixtures.createAccessControl(
          AccessControlType.OP,
          { op }
        );

        await Promise.all([
          ..._.range(numTrue).map(() =>
            fixtures.createAccessControl(
              AccessControlType.DISCORD_ROLE,
              // @everyone role
              {
                roleId: discordGuildId,
                integrationId: organizationDiscordIntegration.id,
              },
              { parentId: parent.id }
            )
          ),
          ..._.range(numTotal - numTrue).map(() =>
            fixtures.createAccessControl(
              AccessControlType.DISCORD_ROLE,
              {
                roleId: "-1",
                integrationId: organizationDiscordIntegration.id,
              },
              { parentId: parent.id }
            )
          ),
        ]);

        return parent;
      };

      describe("AND", () => {
        it("should return false if 0/2 children are met", async () => {
          const ac = await create(AccessControlOp.AND, 0, 2);
          await expect(service.test(ac, user.id)).resolves.toEqual(false);
        });

        it("should return false if 1/2 children are met", async () => {
          const ac = await create(AccessControlOp.AND, 1, 2);
          await expect(service.test(ac, user.id)).resolves.toEqual(false);
        });

        it("should return true if 2/2 children are met", async () => {
          const ac = await create(AccessControlOp.AND, 2, 2);
          await expect(service.test(ac, user.id)).resolves.toEqual(true);
        });
      });

      describe("OR", () => {
        it("should return false if 0/2 children are met", async () => {
          const ac = await create(AccessControlOp.OR, 0, 2);
          await expect(service.test(ac, user.id)).resolves.toEqual(false);
        });

        it("should return false if 1/2 children are met", async () => {
          const ac = await create(AccessControlOp.OR, 1, 2);
          await expect(service.test(ac, user.id)).resolves.toEqual(true);
        });

        it("should return true if 2/2 children are met", async () => {
          const ac = await create(AccessControlOp.OR, 2, 2);
          await expect(service.test(ac, user.id)).resolves.toEqual(true);
        });
      });
    });
  });
});
