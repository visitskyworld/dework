import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
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
      it("should fail if the user is unauthenticated", async () => {
        const response = await client.request({
          app,
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address: "0x123",
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      it("should succeed if the user is authenticated", async () => {
        const user = await fixtures.createUser();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address: "0x123",
          }),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const pm = response.body.data?.paymentMethod;
        expect(pm.type).toEqual(PaymentMethodType.METAMASK);
        expect(pm.address).toEqual("0x123");
        expect(pm.creatorId).toEqual(user.id);
      });
    });
  });
});
