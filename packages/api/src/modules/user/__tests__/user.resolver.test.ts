import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { UserRequests } from "@dewo/api/testing/requests/user.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import faker from "faker";

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
  });
});
