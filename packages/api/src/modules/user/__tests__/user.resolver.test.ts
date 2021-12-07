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
            projectId: project.id,
          });
          const unassignedTask = await fixtures.createTask({
            projectId: project.id,
          });

          const permissions = await getPermissions(user, {
            organizationId: organization.id,
            projectId: project.id,
          });
          expect(permissions.can("read", "Organization")).toBe(true);
          expect(permissions.can("create", "Organization")).toBe(true);
          expect(permissions.can("read", "Project")).toBe(true);
          expect(permissions.can("read", "Task")).toBe(true);

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
        });

        it("projectAdmin", async () => {
          const { user, organization, project } =
            await fixtures.createUserOrgProject();

          const permissions = await getPermissions(user, {
            organizationId: organization.id,
            projectId: project.id,
          });
          expect(permissions.can("update", "Project")).toBe(true);
          expect(permissions.can("delete", "Project")).toBe(true);
          expect(permissions.can("create", "Task")).toBe(true);
          expect(permissions.can("update", "Task")).toBe(true);
          expect(permissions.can("delete", "Task")).toBe(true);
        });
      });
    });
  });
});
