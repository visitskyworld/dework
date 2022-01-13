import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { PaymentNetworkType } from "@dewo/api/models/PaymentNetwork";
import { PaymentTokenType } from "@dewo/api/models/PaymentToken";
import { ProjectRole } from "@dewo/api/models/ProjectMember";
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
    describe("createOrganizationInvite", () => {
      async function fn(
        invitedRole: OrganizationRole,
        inviterRole?: OrganizationRole
      ) {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization(
          {},
          undefined,
          !!inviterRole ? [{ userId: user.id, role: inviterRole }] : []
        );

        return client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: InviteRequests.createOrganizationInvite({
            organizationId: organization.id,
            role: invitedRole,
          }),
        });
      }

      it("FOLLOWER cannot invite FOLLOWER", async () => {
        const res = await fn(
          OrganizationRole.FOLLOWER,
          OrganizationRole.FOLLOWER
        );
        client.expectGqlError(res, HttpStatus.FORBIDDEN);
      });

      it("FOLLOWER cannot invite ADMIN", async () => {
        const res = await fn(OrganizationRole.ADMIN, OrganizationRole.FOLLOWER);
        client.expectGqlError(res, HttpStatus.FORBIDDEN);
      });

      it("ADMIN can invite ADMIN", async () => {
        const res = await fn(OrganizationRole.ADMIN, OrganizationRole.ADMIN);
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ organizationRole: OrganizationRole.ADMIN })
        );
      });

      it("ADMIN cannot invite OWNER", async () => {
        const res = await fn(OrganizationRole.OWNER, OrganizationRole.ADMIN);
        client.expectGqlError(res, HttpStatus.FORBIDDEN);
      });

      it("OWNER can invite ADMIN", async () => {
        const res = await fn(OrganizationRole.ADMIN, OrganizationRole.OWNER);
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ organizationRole: OrganizationRole.ADMIN })
        );
      });

      it("OWNER can invite OWNER", async () => {
        const res = await fn(OrganizationRole.OWNER, OrganizationRole.OWNER);
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ organizationRole: OrganizationRole.OWNER })
        );
      });
    });

    describe("createProjectInvite", () => {
      async function fn(
        invitedRole: ProjectRole,
        inviterProjectRole?: ProjectRole,
        inviterOrganizationRole?: OrganizationRole
      ) {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization(
          {},
          undefined,
          !!inviterOrganizationRole
            ? [{ userId: user.id, role: inviterOrganizationRole }]
            : []
        );

        const project = await fixtures.createProject(
          { organizationId: organization.id },
          undefined,
          !!inviterProjectRole
            ? [{ userId: user.id, role: inviterProjectRole }]
            : []
        );

        return client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: InviteRequests.createProjectInvite({
            projectId: project.id,
            role: invitedRole,
          }),
        });
      }

      it("non-member cannot invite CONTRIBUTOR", async () => {
        const res = await fn(ProjectRole.CONTRIBUTOR);
        client.expectGqlError(res, HttpStatus.FORBIDDEN);
      });

      it("CONTRIBUTOR can invite CONTRIBUTOR", async () => {
        const res = await fn(ProjectRole.CONTRIBUTOR, ProjectRole.CONTRIBUTOR);
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ projectRole: ProjectRole.CONTRIBUTOR })
        );
      });

      it("ADMIN can invite CONTRIBUTOR", async () => {
        const res = await fn(ProjectRole.CONTRIBUTOR, ProjectRole.ADMIN);
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ projectRole: ProjectRole.CONTRIBUTOR })
        );
      });

      it("org FOLLOWER cannot invite CONTRIBUTOR", async () => {
        const res = await fn(
          ProjectRole.CONTRIBUTOR,
          undefined,
          OrganizationRole.FOLLOWER
        );
        client.expectGqlError(res, HttpStatus.FORBIDDEN);
      });

      it("org ADMIN can invite CONTRIBUTOR", async () => {
        const res = await fn(
          ProjectRole.CONTRIBUTOR,
          undefined,
          OrganizationRole.ADMIN
        );
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ projectRole: ProjectRole.CONTRIBUTOR })
        );
      });

      it("org ADMIN can invite ADMIN", async () => {
        const res = await fn(
          ProjectRole.ADMIN,
          undefined,
          OrganizationRole.ADMIN
        );
        expect(res.body.data.invite).toEqual(
          expect.objectContaining({ projectRole: ProjectRole.ADMIN })
        );
      });
    });

    describe("acceptInvite", () => {
      describe("organization", () => {
        it("it should connect user to organization", async () => {
          const { user: inviter, organization } =
            await fixtures.createUserOrgProject();
          const invite = await fixtures.createInvite(
            {
              organizationId: organization.id,
              organizationRole: OrganizationRole.ADMIN,
            },
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
          expect(fetchedInvite.organization.members).toContainEqual(
            expect.objectContaining({
              userId: invited.id,
              role: OrganizationRole.ADMIN,
            })
          );
        });
      });

      describe("project", () => {
        it("it should connect user to project", async () => {
          const { user: inviter, project } =
            await fixtures.createUserOrgProject();
          const invite = await fixtures.createInvite(
            { projectId: project.id, projectRole: ProjectRole.ADMIN },
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
          expect(fetchedInvite.project.members).toContainEqual(
            expect.objectContaining({
              userId: invited.id,
              role: ProjectRole.ADMIN,
            })
          );

          const user = fetchedInvite.project.members.find(
            (m: any) => m.userId === invited.id
          )?.user!;
          expect(user.organizations).toContainEqual(
            expect.objectContaining({ id: project.organizationId })
          );
        });

        it("should assert that user has access to gated token", async () => {
          const network = await fixtures.createPaymentNetwork({
            type: PaymentNetworkType.ETHEREUM,
            config: {
              chainId: -1,
              explorerUrl: "",
              rpcUrl: "https://polygon-rpc.com",
            },
          });
          const token = await fixtures.createPaymentToken({
            type: PaymentTokenType.ERC721,
            // https://polygonscan.com/address/0xc1c6a331d4013f40ca830c06ed47564d0d2b21cd
            address: "0xc1c6a331d4013f40ca830c06ed47564d0d2b21cd",
            networkId: network.id,
          });

          const { user: inviter, project } =
            await fixtures.createUserOrgProject();
          await fixtures.createProjectTokenGate({
            projectId: project.id,
            tokenId: token.id,
          });
          const invite = await fixtures.createInvite(
            { projectId: project.id, projectRole: ProjectRole.ADMIN },
            inviter
          );

          const invited = await fixtures.createUser();
          const response1 = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          client.expectGqlError(response1, HttpStatus.FORBIDDEN);

          await fixtures.createPaymentMethod({
            userId: invited.id,
            networkIds: [network.id],
            // https://opensea.io/0xcedda60f770a23f48960454f173c8e118718321e
            address: "0xcedda60f770a23f48960454f173c8e118718321e",
          });
          const response2 = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response2.status).toEqual(HttpStatus.OK);
          expect(response2.body.data?.invite.project.members).toContainEqual(
            expect.objectContaining({
              userId: invited.id,
              role: ProjectRole.ADMIN,
            })
          );
        });
      });
    });
  });
});
