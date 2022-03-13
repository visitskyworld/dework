import { Organization } from "@dewo/api/models/Organization";
import { Rule, RulePermission } from "@dewo/api/models/rbac/Rule";
import { User } from "@dewo/api/models/User";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { RbacRequests } from "@dewo/api/testing/requests/rbac.requests";
import { AtLeast } from "@dewo/api/types/general";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import { RbacService } from "../rbac.service";

describe("RbacResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;
  let service: RbacService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
    service = app.get(RbacService);
  });

  afterAll(() => app.close());

  async function grant(
    user: User,
    organization: Organization,
    rules: AtLeast<Rule, "permission">[]
  ) {
    const role = await fixtures.createRole({
      organizationId: organization.id,
    });
    for (const rule of rules) {
      await fixtures.createRule({ roleId: role.id, ...rule });
    }
    await service.addRole(user, role);
  }

  describe("Mutations", () => {
    describe("createRole", () => {
      it("should fail for user without role", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRole({
            name: faker.lorem.word(),
            color: faker.lorem.word(),
            organizationId: organization.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed for user with MANAGE_ORGANIZATION permission", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();
        await grant(user, organization, [
          { permission: RulePermission.MANAGE_ORGANIZATION },
        ]);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRole({
            name: faker.lorem.word(),
            color: faker.lorem.word(),
            organizationId: organization.id,
          }),
        });

        const role = response.body.data?.role;
        expect(role).toBeDefined();
        expect(role!.organizationId).toEqual(organization.id);
      });
    });

    describe("createRule", () => {
      it("should fail for user without role", async () => {
        const role = await fixtures.createRole();
        const user = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRule({
            permission: RulePermission.VIEW_PROJECTS,
            roleId: role.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed for user with MANAGE_ORGANIZATION permission", async () => {
        const organization = await fixtures.createOrganization();
        const user = await fixtures.createUser();
        await grant(user, organization, [
          { permission: RulePermission.MANAGE_ORGANIZATION },
        ]);

        const role = await fixtures.createRole({
          organizationId: organization.id,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: RbacRequests.createRule({
            permission: RulePermission.VIEW_PROJECTS,
            roleId: role.id,
          }),
        });

        const rule = response.body.data?.rule;
        expect(rule).toBeDefined();
        expect(rule!.roleId).toEqual(role.id);
        expect(rule!.permission).toEqual(RulePermission.VIEW_PROJECTS);
      });
    });
  });
});
