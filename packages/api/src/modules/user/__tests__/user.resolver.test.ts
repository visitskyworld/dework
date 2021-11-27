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
    describe("createUser", () => {
      it("should succeed if threepid is not connected", async () => {
        const threepid = await fixtures.createThreepid();
        const response = await client.request({
          app,
          body: UserRequests.create(threepid.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const user = response.body.data?.user;
        expect(user).toBeDefined();
        expect(user.imageUrl).toBeDefined();
        expect(user.threepids).toHaveLength(1);
        expect(user.threepids[0].id).toEqual(threepid.id);
      });

      it("should fail if invalid threepid id", async () => {
        const response = await client.request({
          app,
          body: UserRequests.create(faker.datatype.uuid()),
        });

        client.expectGqlError(response, HttpStatus.NOT_FOUND);
      });

      it("should fail if threepid is already connected to other user", async () => {
        const user = await fixtures.createUser();
        const threepidId = (await user.threepids)[0].id;

        const response = await client.request({
          app,
          body: UserRequests.create(threepidId),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });
    });

    describe("connectUser", () => {
      it("should succeed if threepid is not connected to other user and user has no other connection", async () => {
        const threepid = await fixtures.createThreepid({
          source: ThreepidSource.github,
        });
        const user = await fixtures.createUser();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.connectToThreepid(threepid.id),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const u = response.body.data?.user;
        expect(u).toBeDefined();
        expect(u.imageUrl).toBeDefined();
        expect(u.threepids).toHaveLength(2);
        expect(u.threepids[1].id).toEqual(threepid.id);
      });

      it("should fail if threepid is already connected to other user", async () => {
        const existingUser = await fixtures.createUser();
        const threepidId = (await existingUser.threepids)[0].id;

        const user = await fixtures.createUser();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.connectToThreepid(threepidId),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      it("should fail if user already has connection from source", async () => {
        const user = await fixtures.createUser();
        const firstThreepidSource = (await user.threepids)[0].source;
        const secondThreepid = await fixtures.createThreepid({
          source: firstThreepidSource,
        });

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: UserRequests.connectToThreepid(secondThreepid.id),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
        client.expectGqlErrorMessage(
          response,
          `You're already connected to "${firstThreepidSource}"`
        );
      });
    });
  });
});
