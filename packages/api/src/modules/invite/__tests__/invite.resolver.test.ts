import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { InviteRequests } from "@dewo/api/testing/requests/invite.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

describe("InviteResolver", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Mutations", () => {
    describe("createInvite", () => {
      it("should fail if the user is unauthenticated", async () => {
        const response = await client.request({
          app,
          body: InviteRequests.create({}),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should fail if user doesn't have access to organization", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: InviteRequests.create({ organizationId: organization.id }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should succeed if the user is authenticated", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization({
          users: [user],
        });
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: InviteRequests.create({ organizationId: organization.id }),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const invite = response.body.data?.invite;
        expect(invite.inviterId).toEqual(user.id);
        expect(invite.organizationId).toEqual(organization.id);
      });
    });

    describe("acceptInvite", () => {
      it("it should connect user to organization", async () => {
        const inviter = await fixtures.createUser();
        const organization = await fixtures.createOrganization({
          users: [inviter],
        });

        const invite = await fixtures.createInvite(
          { organizationId: organization.id },
          inviter
        );
        const invited = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(invited),
          body: InviteRequests.accept(invite.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetchedInvite = response.body.data?.invite;
        expect(fetchedInvite.organization.users).toContainEqual(
          expect.objectContaining({ id: invited.id })
        );
      });

      xit("should connect user to project", () => {});
    });
  });
});
