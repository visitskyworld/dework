import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { PaymentRequests } from "@dewo/api/testing/requests/payment.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";

describe("PaymentResolver", () => {
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
    describe("createPaymentMethod", () => {
      let network: PaymentNetwork;
      let token: PaymentToken;

      beforeEach(async () => {
        network = await fixtures.createPaymentNetwork();
        token = await fixtures.createPaymentToken({ networkId: network.id });
      });

      it("should fail if the user is unauthenticated", async () => {
        const response = await client.request({
          app,
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address: "0x123",
            networkId: network.id,
            tokenIds: [token.id],
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should fail if trying to create for other user", async () => {
        const authedUser = await fixtures.createUser();
        const otherUser = await fixtures.createUser();

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(authedUser),
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address: "0x123",
            networkId: network.id,
            tokenIds: [token.id],
            userId: otherUser.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.FORBIDDEN);
      });

      xit("should fail if trying to create for project without access", async () => {});

      it("should succeed if the user is authenticated", async () => {
        const user = await fixtures.createUser();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address: "0x123",
            networkId: network.id,
            tokenIds: [token.id],
            userId: user.id,
          }),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const pm = response.body.data?.paymentMethod;
        expect(pm.type).toEqual(PaymentMethodType.METAMASK);
        expect(pm.address).toEqual("0x123");
        expect(pm.creatorId).toEqual(user.id);
      });
    });

    describe("updatePaymentMethod", () => {
      xit("should fail if trying to update if not authed as PM.userId", async () => {});

      xit("should fail if trying to update if authed user is not project admin", async () => {});
    });
  });
});
