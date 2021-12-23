import { PaymentStatus } from "@dewo/api/models/Payment";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
import moment from "moment";
import { PaymentPoller } from "../payment.poller";
import { PaymentService } from "../payment.service";

describe("PaymentPoller", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  let poller: PaymentPoller;
  let service: PaymentService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    poller = app.get(PaymentPoller);
    service = app.get(PaymentService);
  });

  beforeEach(() => {
    poller.isEthereumTxConfirmed = jest.fn(() => Promise.resolve(false));
    poller.isSolanaTxConfirmed = jest.fn(() => Promise.resolve(false));
    poller.isGnosisSafeTxConfirmed = jest.fn(() => Promise.resolve(false));
  });

  afterAll(() => app.close());

  describe("ethereum", () => {
    let network: PaymentNetwork;
    beforeEach(async () => {
      network = await fixtures.createPaymentNetwork({
        slug: "ethereum-testnet",
      });
    });

    it("should set status to CONFIRMED and nextStatusCheckAt to NULL", async () => {
      const payment = await fixtures.createPayment({ networkId: network.id });
      poller.isEthereumTxConfirmed = jest.fn(() => Promise.resolve(true));

      await poller.poll();
      const updated = await service.findById(payment.id);
      expect(updated!.status).toBe(PaymentStatus.CONFIRMED);
      expect(updated!.nextStatusCheckAt).toBe(null);
    });

    it("should set status to FAILED and nextStatusCheckAt to NULL", async () => {
      const payment = await fixtures.createPayment({
        networkId: network.id,
        createdAt: moment().subtract(30, "minute").toDate(),
      });
      await poller.poll();
      const updated = await service.findById(payment.id);
      expect(updated!.status).toBe(PaymentStatus.FAILED);
      expect(updated!.nextStatusCheckAt).toBe(null);
    });

    it("should set nextStatusCheckAt to 1m into the future", async () => {
      const payment = await fixtures.createPayment({ networkId: network.id });
      await poller.poll();
      const updated = await service.findById(payment.id);
      expect(updated!.status).toBe(PaymentStatus.PROCESSING);
      expect(updated!.nextStatusCheckAt?.getTime()).toBeGreaterThan(
        moment().add(1, "minute").subtract(1, "second").valueOf()
      );
      expect(updated!.nextStatusCheckAt?.getTime()).toBeLessThan(
        moment().add(1, "minute").add(1, "second").valueOf()
      );
    });
  });

  xdescribe("gnosis", () => {
    it("should set status to COMPLETED and nextStatusCheckAt to NULL", async () => {});
    it("should set status to FAILED and nextStatusCheckAt to NULL", async () => {});
    it("should set nextStatusCheckAt to 1h into the future if no txHash", async () => {});
    it("should set nextStatusCheckAt to 1h into the future if has txHash", async () => {});
  });

  xdescribe("solana", () => {
    it("should set status to COMPLETED and nextStatusCheckAt to NULL", async () => {});
    it("should set status to FAILED and nextStatusCheckAt to NULL", async () => {});
    it("should set nextStatusCheckAt to 10s into the future", async () => {});
  });
});
