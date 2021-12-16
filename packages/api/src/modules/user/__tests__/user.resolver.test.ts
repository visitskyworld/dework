import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { UserRequests } from "@dewo/api/testing/requests/user.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Ability } from "@casl/ability";
import faker from "faker";
import { User } from "@dewo/api/models/User";
import { GetUserPermissionsInput } from "../dto/GetUserPermissionsInput";
import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { TaskStatusEnum } from "@dewo/api/models/Task";
import { UserDetail, UserDetailType } from "@dewo/api/models/UserDetail";
import { SetUserDetailInput } from "../dto/SetUserDetail";

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
        const paymentMethod = await fixtures.createPaymentMethod();

        const expectedUsername = faker.company.companyName();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.update({
            username: expectedUsername,
            paymentMethodId: paymentMethod.id,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const fetched = response.body.data?.user;
        expect(fetched.username).toEqual(expectedUsername);
        expect(fetched.paymentMethod.id).toEqual(paymentMethod.id);
      });
    });

    describe("setUserDetail", () => {
      const doesDetailExistInDetails = (
        detail: SetUserDetailInput,
        details: UserDetail[]
      ) => {
        return (
          details.find(
            (d: UserDetail) =>
              d.type === detail.type && d.value === detail.value
          ) != null
        );
      };

      it("should fail if is not authed", async () => {
        const response = await client.request({
          app,
          body: UserRequests.setUserDetail({
            type: UserDetailType.twitter,
            value: faker.internet.url(),
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if is authed", async () => {
        const user = await fixtures.createUser();
        const userDetailType = UserDetailType.twitter;
        const url = faker.internet.url();
        const detail = {
          type: userDetailType,
          value: url,
        };
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail(detail),
        });

        expect(response.status).toEqual(HttpStatus.OK);

        const fetched = response.body.data;
        expect(fetched.setUserDetail.id).toEqual(user.id);
        expect(fetched.setUserDetail.details.length).toEqual(1);
        expect(
          doesDetailExistInDetails(detail, fetched.setUserDetail.details)
        ).toEqual(true);
      });

      it("should succeed if detail is replaced on type already existing", async () => {
        const user = await fixtures.createUser();
        const userDetailType = UserDetailType.twitter;
        const url1 = faker.internet.url();
        const url2 = faker.internet.url();

        const detail1 = {
          type: userDetailType,
          value: url1,
        };
        const detail2 = {
          type: userDetailType,
          value: url2,
        };

        const response1 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail(detail1),
        });

        const response2 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail(detail2),
        });

        expect(response1.status).toEqual(HttpStatus.OK);
        expect(response2.status).toEqual(HttpStatus.OK);

        const fetched1 = response1.body.data;
        const fetched2 = response2.body.data;
        expect(fetched1.setUserDetail.id).toEqual(fetched2.setUserDetail.id);

        console.log(fetched1.setUserDetail);
        const newDetail1 = fetched1.setUserDetail.details[0];
        const newDetail2 = fetched2.setUserDetail.details[0];
        expect(newDetail1.type).toEqual(newDetail2.type);
        expect(newDetail1.value).not.toEqual(newDetail2.value);

        expect(
          doesDetailExistInDetails(detail1, fetched1.setUserDetail.details)
        ).toEqual(true);
        expect(
          doesDetailExistInDetails(detail2, fetched2.setUserDetail.details)
        ).toEqual(true);
      });

      it("should succeed if detail is created and deleted", async () => {
        const user = await fixtures.createUser();
        const userDetailType = UserDetailType.twitter;
        const url1 = faker.internet.url();
        const url2 = null;

        const response1 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail({
            type: userDetailType,
            value: url1,
          }),
        });

        const response2 = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.setUserDetail({
            type: userDetailType,
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
        expect(newDetails1.length).toEqual(1);
        expect(newDetails2.length).toEqual(0);
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

      describe("permissions", () => {
        const getPermissions = async (
          user: User,
          input: GetUserPermissionsInput = {}
        ) => {
          const response = await client.request({
            app,
            auth: fixtures.createAuthToken(user),
            body: UserRequests.me(input),
          });

          expect(response.status).toEqual(HttpStatus.OK);
          const permissions = response.body.data?.me.permissions;
          return new Ability(permissions, {
            detectSubjectType: (object) => object.constructor.name,
          });
        };

        it("everyone", async () => {
          const { organization, project } =
            await fixtures.createUserOrgProject();
          const user = await fixtures.createUser();
          const assignedTask = await fixtures.createTask({
            assignees: [user],
            status: TaskStatusEnum.IN_PROGRESS,
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
          expect(permissions.can("create", "Organization")).toBe(true);
          expect(permissions.can("read", "Project")).toBe(true);
          expect(permissions.can("read", "Task")).toBe(true);

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

        it("organizationMember", async () => {
          const user = await fixtures.createUser();
          const { organization } = await fixtures.createUserOrgProject({
            organization: {
              members: [{ userId: user.id, role: OrganizationRole.MEMBER }],
            },
          });

          const permissions = await getPermissions(user, {
            organizationId: organization.id,
          });
          expect(permissions.can("update", "Organization")).toBe(false);
          expect(permissions.can("delete", "Organization")).toBe(false);
          expect(permissions.can("create", "Project")).toBe(false);
          expect(permissions.can("create", "Task")).toBe(false);
        });
      });
    });
  });
});
