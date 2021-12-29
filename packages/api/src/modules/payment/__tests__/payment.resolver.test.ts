import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import {
  PaymentToken,
  PaymentTokenType,
  PaymentTokenVisibility,
} from "@dewo/api/models/PaymentToken";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { PaymentRequests } from "@dewo/api/testing/requests/payment.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { CreatePaymentTokenInput } from "../dto/CreatePaymentTokenInput";
import faker from "faker";

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

    describe("createPaymentToken", () => {
      it("should add payment token", async () => {
        const user = await fixtures.createUser();
        const network = await fixtures.createPaymentNetwork();
        const input: CreatePaymentTokenInput = {
          type: PaymentTokenType.ERC20,
          address: "0x123",
          networkId: network.id,
          exp: faker.datatype.number({ min: 1, max: 10 }),
          name: faker.company.companyName(),
          symbol: faker.datatype.uuid(),
        };

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: PaymentRequests.createPaymentToken(input),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const token = response.body.data?.token;
        expect(token.type).toEqual(input.type);
        expect(token.address).toEqual(input.address);
        expect(token.networkId).toEqual(input.networkId);
        expect(token.exp).toEqual(input.exp);
        expect(token.name).toEqual(input.name);
        expect(token.symbol).toEqual(input.symbol);
        expect(token.visibility).toEqual(PaymentTokenVisibility.IF_HAS_BALANCE);
      });

      it("should not override payment token data if already exists", async () => {
        const token = await fixtures.createPaymentToken({ address: "0x321" });
        const user = await fixtures.createUser();

        const input: CreatePaymentTokenInput = {
          type: token.type,
          address: token.address!,
          networkId: token.networkId,
          exp: faker.datatype.number({ min: 1, max: 10 }),
          name: faker.company.companyName(),
          symbol: faker.datatype.uuid(),
        };

        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: PaymentRequests.createPaymentToken(input),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const updatedToken = response.body.data?.token;
        expect(updatedToken.id).toEqual(token.id);
        expect(updatedToken.type).toEqual(token.type);
        expect(updatedToken.address).toEqual(token.address);
        expect(updatedToken.networkId).toEqual(token.networkId);
        expect(updatedToken.exp).toEqual(token.exp);
        expect(updatedToken.name).toEqual(token.name);
        expect(updatedToken.symbol).toEqual(token.symbol);
      });
    });

    describe("updatePaymentMethod", () => {
      xit("should fail if trying to update if not authed as PM.userId", async () => {});

      xit("should fail if trying to update if authed user is not project admin", async () => {});
    });
  });
});
