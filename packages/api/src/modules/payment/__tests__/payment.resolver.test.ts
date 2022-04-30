import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import {
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

      beforeEach(async () => {
        network = await fixtures.createPaymentNetwork();
      });

      it("should fail if the user is unauthenticated", async () => {
        const project = await fixtures.createProject();
        const response = await client.request({
          app,
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address: fixtures.address(),
            networkId: network.id,
            projectId: project.id,
          }),
        });

        client.expectGqlError(response, HttpStatus.UNAUTHORIZED);
      });

      xit("should fail if trying to create for project without access", async () => {});

      it("should succeed if the user is authenticated", async () => {
        const user = await fixtures.createUser();
        const address = fixtures.address();
        const project = await fixtures.createProject();
        const response = await client.request({
          app,
          auth: fixtures.createAuthToken(user),
          body: PaymentRequests.createPaymentMethod({
            type: PaymentMethodType.METAMASK,
            address,
            networkId: network.id,
            projectId: project.id,
          }),
        });

        expect(response.statusCode).toEqual(HttpStatus.OK);
        const pm = response.body.data?.paymentMethod;
        expect(pm.type).toEqual(PaymentMethodType.METAMASK);
        expect(pm.address).toEqual(address);
        expect(pm.creatorId).toEqual(user.id);
      });
    });

    describe("createPaymentToken", () => {
      it("should add payment token", async () => {
        const user = await fixtures.createUser();
        const network = await fixtures.createPaymentNetwork();
        const input: CreatePaymentTokenInput = {
          type: PaymentTokenType.ERC20,
          address: fixtures.address(),
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
        const token = await fixtures.createPaymentToken({
          address: fixtures.address(),
        });
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

      it("should use correct casing for ERC20", async () => {
        const networkId = await fixtures
          .createPaymentNetwork()
          .then((n) => n.id);

        const address1 = "0x86e7598820f95A27C7d55CFD2253035C18a37DDE";
        const address2 = address1.toLowerCase();
        const address3 = "0x86E7598820F95A27C7D55CFD2253035C18A37DDE";

        const token1 = await fixtures.createPaymentToken({
          type: PaymentTokenType.ERC20,
          address: address1,
          networkId,
        });
        const token2 = await fixtures.createPaymentToken({
          type: PaymentTokenType.ERC20,
          address: address2,
          networkId,
        });
        const token3 = await fixtures.createPaymentToken({
          type: PaymentTokenType.ERC20,
          address: address3,
          networkId,
        });

        expect(token1.address).toEqual(address1);
        expect(token2.address).toEqual(address1);
        expect(token3.address).toEqual(address1);
        expect(token1.id).toEqual(token2.id);
        expect(token1.id).toEqual(token3.id);
      });

      it("should not change casing for SPL_TOKEN", async () => {
        const networkId = await fixtures
          .createPaymentNetwork()
          .then((n) => n.id);

        const address1 = "F5SjYkNBNF29iKsLf5r665n58qRsw4PjEwtVTLBZzGh";
        const address2 = address1.toLowerCase();

        const token1 = await fixtures.createPaymentToken({
          type: PaymentTokenType.SPL_TOKEN,
          address: address1,
          networkId,
        });
        const token2 = await fixtures.createPaymentToken({
          type: PaymentTokenType.SPL_TOKEN,
          address: address2,
          networkId,
        });

        expect(token1.address).toEqual(address1);
        expect(token2.address).toEqual(address2);
      });
    });

    describe("updatePaymentMethod", () => {
      xit("should fail if trying to update if not authed as PM.userId", async () => {});

      xit("should fail if trying to update if authed user is not project admin", async () => {});
    });
  });
});
