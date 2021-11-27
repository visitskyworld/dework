import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { UserRequests } from "@dewo/api/testing/requests/user.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

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
      it("should fail if threepid is already connected to other user", async () => {});

      it("should fail if user already has connection from source", async () => {});

      it("should succeed if threepid is not connected to other user and user has no other connection", async () => {});
    });
  });
});
