import { OrganizationRole } from "@dewo/api/models/OrganizationMember";

import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { InviteRequests } from "@dewo/api/testing/requests/invite.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { TaskReaction } from "@dewo/api/models/TaskReaction";
import { Project } from "@dewo/api/models/Project";

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
      it("should succeed for owner", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization({}, user);
        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: InviteRequests.createOrganizationInvite({
            organizationId: organization.id,
          }),
        });

        expect(res.body.data?.invite).toBeDefined();
        expect(res.body.data?.invite.organizationId).toEqual(organization.id);
      });

      it("should fail for random user", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: InviteRequests.createOrganizationInvite({
            organizationId: organization.id,
          }),
        });

        client.expectGqlError(res, HttpStatus.FORBIDDEN);
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
        it("should give user ability to manage organization", async () => {
          const inviter = await fixtures.createUser();
          const invited = await fixtures.createUser();
          const organization = await fixtures.createOrganization({}, inviter);
          const invite = await fixtures.createInvite(
            { organizationId: organization.id },
            inviter
          );

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

          const ability = await fixtures.grantPermissions(
            invited.id,
            organization.id,
            []
          );
          expect(ability.can("update", organization)).toBe(true);
        });
      });

      describe("project", () => {
        it("should give CONTRIBUTORs the right access", async () => {
          const {
            user: inviter,
            project,
            organization,
          } = await fixtures.createUserOrgProject();
          const invited = await fixtures.createUser();

          const invite = await fixtures.createInvite(
            { projectId: project.id, projectRole: ProjectRole.CONTRIBUTOR },
            inviter
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetchedInvite = response.body.data?.invite;
          expect(fetchedInvite.project.organization.users).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );

          const ability = await fixtures.grantPermissions(
            invited.id,
            organization.id,
            []
          );
          expect(ability.can("update", Project)).toBe(false);
          expect(ability.can("create", TaskReaction)).toBe(true);
        });

        it("should give ADMINs the right access", async () => {
          const {
            user: inviter,
            project,
            organization,
          } = await fixtures.createUserOrgProject();
          const invited = await fixtures.createUser();

          const invite = await fixtures.createInvite(
            { projectId: project.id, projectRole: ProjectRole.ADMIN },
            inviter
          );

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(invited),
            body: InviteRequests.accept(invite.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const fetchedInvite = response.body.data?.invite;
          expect(fetchedInvite.project.organization.users).toContainEqual(
            expect.objectContaining({ id: invited.id })
          );

          const ability = await fixtures.grantPermissions(
            invited.id,
            organization.id,
            []
          );
          expect(ability.can("update", Project)).toBe(true);
          expect(ability.can("create", TaskReaction)).toBe(true);
        });
      });

      /*
      describe("project", () => {
        it("should connect user to project", async () => {
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

        describe("asserting balances", () => {
          let polygonNetwork: PaymentNetwork;

          beforeEach(async () => {
            polygonNetwork = await fixtures.createPaymentNetwork({
              type: PaymentNetworkType.ETHEREUM,
              config: {
                chainId: -1,
                explorerUrl: "",
                rpcUrl: "https://polygon-rpc.com",
              },
            });
          });

          it("should assert that user has gated ERC721 token", async () => {
            const token = await fixtures.createPaymentToken({
              type: PaymentTokenType.ERC721,
              // https://polygonscan.com/address/0xc1c6a331d4013f40ca830c06ed47564d0d2b21cd
              address: "0xc1c6a331d4013f40ca830c06ed47564d0d2b21cd",
              networkId: polygonNetwork.id,
            });
            const { user: inviter, project } =
              await fixtures.createUserOrgProject();
            await fixtures.createProjectTokenGate({
              projectId: project.id,
              tokenId: token.id,
              role: ProjectRole.ADMIN,
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
              networkIds: [polygonNetwork.id],
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

          it("should assert that user has gated ERC1155 token", async () => {
            const token = await fixtures.createPaymentToken({
              type: PaymentTokenType.ERC1155,
              // https://polygonscan.com/address/0xc9cccffa96dc0f79661eaa2e72bbbcc82acd06db
              address: "0xc9cccffa96dc0f79661eaa2e72bbbcc82acd06db",
              networkId: polygonNetwork.id,
              identifier: "1",
            });
            const { user: inviter, project } =
              await fixtures.createUserOrgProject();
            await fixtures.createProjectTokenGate({
              projectId: project.id,
              tokenId: token.id,
              role: ProjectRole.ADMIN,
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
              networkIds: [polygonNetwork.id],
              // https://polygonscan.com/token/0xc9cccffa96dc0f79661eaa2e72bbbcc82acd06db#balances
              address: "0x0030c9dd1da63af7d7df6b8332aef5fae99f536b",
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
      */
    });
  });
});
