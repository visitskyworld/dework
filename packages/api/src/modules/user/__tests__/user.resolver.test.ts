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
import { Ability } from "@casl/ability";
import faker from "faker";
import { User } from "@dewo/api/models/User";
import { GetUserPermissionsInput } from "../dto/GetUserPermissionsInput";
import { TaskStatus } from "@dewo/api/models/Task";
import { EntityDetailType } from "@dewo/api/models/EntityDetail";
import { SetUserDetailInput } from "../dto/SetUserDetailInput";
import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { PaymentNetworkType } from "@dewo/api/models/PaymentNetwork";
import { ProjectVisibility } from "@dewo/api/models/Project";
import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";

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

        describe("metamask", () => {
          it("should connect metamask address as payment method on all relevant networks", async () => {
            const address = faker.datatype.uuid();
            const threepid = await fixtures.createThreepid({
              source: ThreepidSource.metamask,
              threepid: address,
            });

            const ethNetwork1 = await fixtures.createPaymentNetwork({
              type: PaymentNetworkType.ETHEREUM,
            });
            const ethNetwork2 = await fixtures.createPaymentNetwork({
              type: PaymentNetworkType.ETHEREUM,
            });

            const response = await client.request({
              app,
              body: UserRequests.authWithThreepid(threepid.id),
            });

            expect(response.status).toEqual(HttpStatus.OK);
            const user = response.body.data?.authWithThreepid.user;
            expect(user.paymentMethods).toContainEqual(
              expect.objectContaining({
                address,
                type: PaymentMethodType.METAMASK,
                networks: [{ id: ethNetwork1.id }],
              })
            );
            expect(user.paymentMethods).toContainEqual(
              expect.objectContaining({
                address,
                type: PaymentMethodType.METAMASK,
                networks: [{ id: ethNetwork2.id }],
              })
            );
          });
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

        it("should fail if someone else is connected to 3pid", async () => {
          const threepid = await fixtures.createThreepid({
            source: ThreepidSource.discord,
          });
          await fixtures.createUser(threepid);

          const user = await fixtures.createUser({
            source: ThreepidSource.github,
          });
          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: UserRequests.authWithThreepid(threepid.id),
          });

          client.expectGqlError(response, HttpStatus.FORBIDDEN);
          client.expectGqlErrorMessage(response, "Account already connected");
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
        const deletedOrg = await fixtures.createOrganization(
          { deletedAt: new Date() },
          user
        );

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

    describe("permissions", () => {
      const getPermissions = async (
        user: User | undefined,
        input: GetUserPermissionsInput = {}
      ) => {
        const response = await client.request({
          app,
          auth: !!user ? fixtures.createAuthToken(user) : undefined,
          body: UserRequests.permissions(input),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const permissions = response.body.data?.permissions;
        return new Ability(permissions, {
          detectSubjectType: (object) => object.constructor.name,
        });
      };

      it("everyone", async () => {
        const { organization, project } = await fixtures.createUserOrgProject();
        const user = await fixtures.createUser();
        const assignedTask = await fixtures.createTask({
          assignees: [user],
          status: TaskStatus.IN_PROGRESS,
          projectId: project.id,
        });
        const unassignedTask = await fixtures.createTask({
          projectId: project.id,
        });
        const ownedTask = await fixtures.createTask({
          projectId: project.id,
          ownerId: user.id,
        });

        const permissions = await getPermissions(user, {
          organizationId: organization.id,
          projectId: project.id,
        });
        expect(permissions.can("read", "Organization")).toBe(true);
        expect(permissions.can("read", "Project")).toBe(true);
        expect(permissions.can("read", "Task")).toBe(true);

        expect(permissions.can("create", "Organization")).toBe(true);
        expect(permissions.can("create", "Project")).toBe(false);
        expect(permissions.can("create", "Task")).toBe(false);

        expect(permissions.can("update", ownedTask)).toBe(true);
        expect(permissions.can("update", assignedTask)).toBe(true);
        expect(permissions.can("update", unassignedTask)).toBe(false);
      });

      it("organizationAdmin", async () => {
        const { user, organization } = await fixtures.createUserOrgProject();

        const permissions = await getPermissions(user, {
          organizationId: organization.id,
        });
        expect(permissions.can("update", "Organization")).toBe(true);
        expect(permissions.can("delete", "Organization")).toBe(true);
        expect(permissions.can("create", "Project")).toBe(true);
        expect(permissions.can("update", "Project")).toBe(true);
        expect(permissions.can("delete", "Project")).toBe(true);
        expect(permissions.can("create", "Task")).toBe(true);
        expect(permissions.can("update", "Task")).toBe(true);
        expect(permissions.can("delete", "Task")).toBe(true);
      });

      it("projectAdmin", async () => {
        const user = await fixtures.createUser();
        const organization = await fixtures.createOrganization();
        const project = await fixtures.createProject(
          { organizationId: organization.id },
          undefined,
          [{ userId: user.id, role: ProjectRole.ADMIN }]
        );

        const permissions = await getPermissions(user, {
          projectId: project.id,
        });
        expect(permissions.can("create", "Project")).toBe(false);
        expect(permissions.can("delete", "Project")).toBe(false);
        expect(permissions.can("update", "Project")).toBe(true);
        expect(permissions.can("create", "Task")).toBe(true);
        expect(permissions.can("update", "Task")).toBe(true);
        expect(permissions.can("delete", "Task")).toBe(true);
      });
    });

    describe("getUser", () => {
      it("should return tasks from private project only for authed user", async () => {
        const assignedUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();
        const project = await fixtures.createProject({
          visibility: ProjectVisibility.PRIVATE,
        });
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
    });
  });
});
