import {
  ThreepidSource,
  GithubThreepidConfig,
  DiscordThreepidConfig,
} from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { UserRequests } from "@dewo/api/testing/requests/user.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";
import { User } from "@dewo/api/models/User";
import { EntityDetailType } from "@dewo/api/models/EntityDetail";
import { SetUserDetailInput } from "../dto/SetUserDetailInput";
import { RbacService } from "../../rbac/rbac.service";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";

describe("UserResolver", () => {
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
    describe("authWithThreepid", () => {
      describe("unauthed", () => {
        it("should succeed if threepid is not connected", async () => {
          const threepid = await fixtures.createThreepid();
          const response = await client.request({
            app,
            body: UserRequests.authWithThreepid(threepid.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const user = response.body.data?.authWithThreepid.user;
          expect(user).toBeDefined();
          expect(user.imageUrl).toBeDefined();
          expect(user.threepids).toHaveLength(1);
          expect(user.threepids[0].id).toEqual(threepid.id);
        });

        it("should succeed if threepid is connected", async () => {
          const user = await fixtures.createUser();
          const threepidId = (await user.threepids)[0].id;

          const response = await client.request({
            app,
            body: UserRequests.authWithThreepid(threepidId),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const updatedUser = response.body.data?.authWithThreepid.user;
          expect(updatedUser.id).toEqual(user.id);
          expect(updatedUser.threepids).toHaveLength(1);
          expect(updatedUser.threepids[0].id).toEqual(threepidId);
        });

        it("should fail if invalid threepid id", async () => {
          const response = await client.request({
            app,
            body: UserRequests.authWithThreepid(faker.datatype.uuid()),
          });

          client.expectGqlError(response, HttpStatus.NOT_FOUND);
        });

        describe("unique username", () => {
          it("should have username from threepid", async () => {
            const username = faker.internet.userName();
            const user = await fixtures.createUser({
              source: ThreepidSource.discord,
              // @ts-ignore
              config: { profile: { username } },
            });
            const threepidId = (await user.threepids)[0].id;

            const response = await client.request({
              app,
              body: UserRequests.authWithThreepid(threepidId),
            });

            expect(response.status).toEqual(HttpStatus.OK);
            const fetched = response.body.data?.authWithThreepid.user;
            expect(fetched.username).toEqual(username);
          });

          it("should generate unique username if username already exists", async () => {
            function createWithUsername(username: string) {
              return fixtures.createUser({
                source: ThreepidSource.discord,
                // @ts-ignore
                config: { profile: { username } },
              });
            }

            const username = faker.internet.userName();
            await Promise.all([
              createWithUsername(username),
              createWithUsername(`${username}1`),
              createWithUsername(`${username}3`),
            ]);

            const threepid = await fixtures.createThreepid({
              source: ThreepidSource.discord,
              // @ts-ignore
              config: { profile: { username } },
            });
            const response = await client.request({
              app,
              body: UserRequests.authWithThreepid(threepid.id),
            });

            expect(response.status).toEqual(HttpStatus.OK);
            const fetched = response.body.data?.authWithThreepid.user;
            expect(fetched.username).toEqual(`${username}2`);
          });
        });
      });

      describe("authed", () => {
        it("should succeed if has no previous connection to 3pid source", async () => {
          const user = await fixtures.createUser({
            source: ThreepidSource.discord,
          });
          const threepid = await fixtures.createThreepid({
            source: ThreepidSource.github,
          });

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: UserRequests.authWithThreepid(threepid.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const updatedUser = response.body.data?.authWithThreepid.user;
          expect(updatedUser.threepids).toHaveLength(2);
          expect(updatedUser.threepids[1].id).toEqual(threepid.id);
        });

        it("should fail if is already connected to 3pid source", async () => {
          const user = await fixtures.createUser({
            source: ThreepidSource.discord,
          });
          const threepid = await fixtures.createThreepid({
            source: ThreepidSource.discord,
          });

          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: UserRequests.authWithThreepid(threepid.id),
          });

          client.expectGqlError(response, HttpStatus.FORBIDDEN);
          client.expectGqlErrorMessage(
            response,
            'You\'re already connected to "discord"'
          );
        });

        it("should move over threepid if was connected to other user", async () => {
          const threepid = await fixtures.createThreepid({
            source: ThreepidSource.discord,
          });
          const originalUser = await fixtures.createUser(threepid);

          const user = await fixtures.createUser({
            source: ThreepidSource.github,
          });
          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: UserRequests.authWithThreepid(threepid.id),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const updatedUser = response.body.data?.authWithThreepid.user;
          expect(updatedUser.threepids).toContainEqual(
            expect.objectContaining({ id: threepid.id })
          );

          const updatedOriginalUser = await fixtures.getUser(originalUser.id);
          const originalUserThreepids = await updatedOriginalUser?.threepids;

          expect(originalUserThreepids).toHaveLength(0);
        });
      });

      it("should auto populate location & Github profile-url details on 1st Github auth", async () => {
        const threepid = await fixtures.createThreepid({
          source: ThreepidSource.github,
          config: {
            profile: {
              profileUrl: "github.com/my-url",
              _json: { location: "London" },
            },
          } as GithubThreepidConfig,
        });
        const user = await fixtures.createUser(threepid);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.authWithThreepid(threepid.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const updatedUser = response.body.data?.authWithThreepid.user;
        expect(updatedUser.details).toHaveLength(2);
        expect(updatedUser.details).toContainEqual(
          expect.objectContaining({
            type: EntityDetailType.location,
            value: "London",
          })
        );
        expect(updatedUser.details).toContainEqual(
          expect.objectContaining({
            type: EntityDetailType.github,
            value: "github.com/my-url",
          })
        );
      });

      it("should auto populate Discord username detail on 1st Discord auth", async () => {
        const threepid = await fixtures.createThreepid({
          source: ThreepidSource.discord,
          config: {
            profile: {
              id: "123",
              username: "my-username",
              discriminator: "1234",
              locale: "en_US",
            },
          } as DiscordThreepidConfig,
        });
        const user = await fixtures.createUser(threepid);

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.authWithThreepid(threepid.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const updatedUser = response.body.data?.authWithThreepid.user;
        expect(updatedUser.details).toHaveLength(1);
        expect(updatedUser.details).toContainEqual({
          type: EntityDetailType.discord,
          value: "my-username#1234",
        });
      });

      describe("onboarding prompts", () => {
        it("should create Discord onboarding prompt", async () => {
          const threepid = await fixtures.createThreepid({
            source: ThreepidSource.metamask,
            threepid: fixtures.address(),
          });

          const res = await client.request({
            app,
            body: UserRequests.authWithThreepid(threepid.id),
          });

          expect(res.body.data?.authWithThreepid.user.prompts).toContainEqual(
            expect.objectContaining({
              type: "Onboarding.v2.ConnectDiscord",
            })
          );
        });

        it("should create wallet onboarding prompt", async () => {
          const threepid = await fixtures.createThreepid({
            source: ThreepidSource.discord,
          });

          const res = await client.request({
            app,
            body: UserRequests.authWithThreepid(threepid.id),
          });

          expect(res.body.data?.authWithThreepid.user.prompts).toContainEqual(
            expect.objectContaining({
              type: "Onboarding.v2.ConnectWallet",
            })
          );
        });
      });
    });

    describe("updateUser", () => {
      it("should fail if is not authed", async () => {
        const response = await client.request({
          app,
          body: UserRequests.update({
            username: faker.company.companyName(),
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if is authed", async () => {
        const user = await fixtures.createUser();
        const expectedUsername = faker.company.companyName();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.update({
            username: expectedUsername,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.user;
        expect(fetched.username).toEqual(expectedUsername);
      });
    });

    describe("setUserDetail", () => {
      const setUserDetail = async (detail: SetUserDetailInput, user: User) => {
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail(detail),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        return response.body.data.setUserDetail;
      };

      it("should fail if is not authed", async () => {
        const response = await client.request({
          app,
          body: UserRequests.setUserDetail({
            type: EntityDetailType.twitter,
            value: faker.internet.url(),
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if is authed", async () => {
        const user = await fixtures.createUser();
        const detail: SetUserDetailInput = {
          type: EntityDetailType.twitter,
          value: faker.internet.url(),
        };

        const fetched = await setUserDetail(detail, user);
        expect(fetched.id).toEqual(user.id);
        expect(fetched.details.length).toEqual(2);
        expect(fetched.details).toContainEqual(
          expect.objectContaining({ type: detail.type, value: detail.value })
        );
      });

      it("should succeed if detail is replaced on type already existing", async () => {
        const user = await fixtures.createUser();
        const detail1: SetUserDetailInput = {
          type: EntityDetailType.twitter,
          value: faker.internet.url(),
        };
        const detail2: SetUserDetailInput = {
          type: EntityDetailType.twitter,
          value: faker.internet.url(),
        };

        const fetched1 = await setUserDetail(detail1, user);
        expect(fetched1.details).toHaveLength(2);
        expect(fetched1.details).toContainEqual(
          expect.objectContaining({ type: detail1.type, value: detail1.value })
        );

        const fetched2 = await setUserDetail(detail2, user);
        expect(fetched2.details).toHaveLength(2);
        expect(fetched2.details).toContainEqual(
          expect.objectContaining({ type: detail2.type, value: detail2.value })
        );
      });

      it("should succeed if detail is created and deleted", async () => {
        const user = await fixtures.createUser();
        const entityDetailType = EntityDetailType.twitter;
        const url1 = faker.internet.url();
        const url2 = null;

        const response1 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail({
            type: entityDetailType,
            value: url1,
          }),
        });

        const response2 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail({
            type: entityDetailType,
            value: url2,
          }),
        });

        expect(response1.status).toEqual(HttpStatus.OK);
        expect(response2.status).toEqual(HttpStatus.OK);

        const fetched1 = response1.body.data;
        const fetched2 = response2.body.data;
        expect(fetched1.setUserDetail.id).toEqual(fetched2.setUserDetail.id);

        const newDetails1 = fetched1.setUserDetail.details;
        const newDetails2 = fetched2.setUserDetail.details;
        expect(newDetails1.length).toEqual(2);
        expect(newDetails2.length).toEqual(1);
      });
    });
  });

  describe("Queries", () => {
    describe("me", () => {
      it("should return all non-deleted tasks", async () => {
        const user = await fixtures.createUser();
        const otherUser = await fixtures.createUser();

        const task = await fixtures.createTask({
          assignees: [user, otherUser],
        });
        const deletedTask = await fixtures.createTask({
          assignees: [user],
          deletedAt: new Date(),
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.me(),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const me = response.body.data?.me;
        expect(me.tasks).toHaveLength(1);
        expect(me.tasks).toContainEqual(
          expect.objectContaining({
            id: task.id,
            assignees: expect.arrayContaining([
              expect.objectContaining({ id: user.id }),
              // expect.objectContaining({ id: otherUser.id }),
            ]),
          })
        );
        expect(me.tasks).not.toContainEqual(
          expect.objectContaining({ id: deletedTask.id })
        );
      });

      it("should return non-deleted organizations", async () => {
        const user = await fixtures.createUser();
        const existingOrg = await fixtures.createOrganization({}, user);
        const deletedOrg = await fixtures.createOrganization({}, user);
        await fixtures.updateOrganization({
          id: deletedOrg.id,
          deletedAt: new Date(),
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.me(),
        });
        expect(response.status).toEqual(HttpStatus.OK);
        const me = response.body.data?.me;
        expect(me.organizations).toContainEqual(
          expect.objectContaining({ id: existingOrg.id })
        );
        expect(me.organizations).not.toContainEqual(
          expect.objectContaining({ id: deletedOrg.id })
        );
      });
    });

    describe("getUser", () => {
      it("should not return tasks from private projects", async () => {
        const assignedUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const project = await fixtures.createProject();
        await fixtures.createRole(
          { organizationId: project.organizationId, fallback: true },
          [
            {
              projectId: project.id,
              permission: RulePermission.VIEW_PROJECTS,
              inverted: true,
            },
          ]
        );

        const task = await fixtures.createTask({
          projectId: project.id,
          assignees: [assignedUser],
        });

        const assignedRes = await client.request({
          app,
          auth: fixtures.createAuthToken(assignedUser),
          body: UserRequests.getUser(assignedUser.id),
        });
        const otherRes = await client.request({
          app,
          auth: fixtures.createAuthToken(otherUser),
          body: UserRequests.getUser(assignedUser.id),
        });

        expect(assignedRes.body.data.user.tasks).toContainEqual(
          expect.objectContaining({ id: task.id })
        );
        expect(otherRes.body.data.user.tasks).not.toContainEqual(
          expect.objectContaining({ id: task.id })
        );
      });

      it("should not return hidden organizations for other users", async () => {
        const user = await fixtures.createUser();
        const otherUser = await fixtures.createUser();

        const organization = await fixtures.createOrganization({}, user);
        const fallbackRole = await organization.roles.then((r) =>
          r.find((r) => r.fallback)
        );
        await app.get(RbacService).updateUserRole({
          userId: user.id,
          roleId: fallbackRole!.id,
          hidden: true,
        });

        const res = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.getUser(user.id),
        });
        const otherRes = await client.request({
          app,
          auth: fixtures.createAuthToken(otherUser),
          body: UserRequests.getUser(user.id),
        });

        expect(res.body.data.user.organizations).toContainEqual(
          expect.objectContaining({ id: organization.id })
        );
        expect(otherRes.body.data.user.organizations).not.toContainEqual(
          expect.objectContaining({ id: organization.id })
        );
      });
    });
  });
});
