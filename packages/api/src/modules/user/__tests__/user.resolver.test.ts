import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { UserRequests } from "@dewo/api/testing/requests/user.requests";
import { INestApplication } from "@nestjs/common";

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
      it("should fail if threepid is already connected to other user", async () => {
        const threepid = await fixtures.createThreepid();
        const response = await client.request({
          app,
          body: UserRequests.create(threepid.id),
        });

        console.warn(response);
      });

      it("should succeed if threepid is not connected", async () => {});
    });

    describe("connectUser", () => {
      it("should fail if threepid is already connected to other user", async () => {});

      it("should fail if user already has connection from source", async () => {});

      it("should succeed if threepid is not connected to other user and user has no other connection", async () => {});
    });
  });
});
