import { getTestApp } from "@dewo/api/testing/getTestApp";
import { GraphQLTestClient } from "@dewo/api/testing/GraphQLTestClient";
import { ThreepidRequests } from "@dewo/api/testing/requests/threepid.requests";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { ethers } from "ethers";
import faker from "faker";

describe("ThreepidResolver", () => {
  let app: INestApplication;
  let client: GraphQLTestClient;

  beforeAll(async () => {
    app = await getTestApp();
    client = app.get(GraphQLTestClient);
  });

  afterAll(() => app.close());

  describe("Mutations", () => {
    describe("createMetamaskThreepid", () => {
      it("should create a threepid with the right address", async () => {
        const wallet = ethers.Wallet.createRandom();
        const message = faker.datatype.uuid();
        const signature = await wallet.signMessage(message);

        const response = await client.request({
          app,
          body: ThreepidRequests.createMetamaskThreepid({
            message,
            signature,
            address: wallet.address,
          }),
        });

        expect(response.status).toEqual(HttpStatus.OK);
        const threepid = response.body.data?.threepid;
        expect(threepid).toBeDefined();
        expect(threepid.threepid.toLowerCase()).toEqual(
          wallet.address.toLowerCase()
        );
      });

      it("should return existing threepid on second auth", async () => {
        const wallet = ethers.Wallet.createRandom();
        const message = faker.datatype.uuid();
        const signature = await wallet.signMessage(message);

        const response1 = await client.request({
          app,
          body: ThreepidRequests.createMetamaskThreepid({
            message,
            signature,
            address: wallet.address,
          }),
        });
        const response2 = await client.request({
          app,
          body: ThreepidRequests.createMetamaskThreepid({
            message,
            signature,
            address: wallet.address,
          }),
        });

        const threepid1 = response1.body.data!.threepid;
        const threepid2 = response2.body.data!.threepid;
        expect(threepid1.id).toEqual(threepid2.id);
        expect(threepid1.threepid).toEqual(threepid2.threepid);
      });

      it("should fail if signature is not valid", async () => {
        const wallet = ethers.Wallet.createRandom();
        const message = faker.datatype.uuid();
        const otherMessage = faker.datatype.uuid();
        const signature = await wallet.signMessage(message);

        const response = await client.request({
          app,
          body: ThreepidRequests.createMetamaskThreepid({
            message: otherMessage,
            signature,
            address: wallet.address,
          }),
        });

        client.expectGqlError(response, HttpStatus.BAD_REQUEST);
      });
    });
  });
});
