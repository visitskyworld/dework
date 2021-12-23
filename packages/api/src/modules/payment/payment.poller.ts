import { Payment, PaymentStatus } from "@dewo/api/models/Payment";
import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as ms from "milliseconds";
import moment from "moment";

@Injectable()
export class PaymentPoller {
  private logger = new Logger(this.constructor.name);

  private checkInterval: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: ms.minutes(1),
    [PaymentMethodType.PHANTOM]: ms.seconds(10),
    [PaymentMethodType.GNOSIS_SAFE]: ms.hours(1),
  };

  private checkTimeout: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: ms.minutes(30),
    [PaymentMethodType.PHANTOM]: ms.minutes(10),
    [PaymentMethodType.GNOSIS_SAFE]: Number.MAX_SAFE_INTEGER,
  };

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>
  ) {}

  public async poll(): Promise<void> {
    this.logger.log("Polling for blockchain confirmations");

    const payments = await this.paymentRepo
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.network", "network")
      .leftJoinAndSelect("p.paymentMethod", "paymentMethod")
      .where("p.status = :status", { status: PaymentStatus.PROCESSING })
      .andWhere(
        "( p.nextStatusCheckAt IS NULL OR p.nextStatusCheckAt < CURRENT_DATE )"
      )
      .getMany();

    const isConfirmedFn = {
      [PaymentMethodType.METAMASK]: this.isEthereumTxConfirmed,
      [PaymentMethodType.PHANTOM]: this.isSolanaTxConfirmed,
      [PaymentMethodType.GNOSIS_SAFE]: this.isGnosisSafeTxConfirmed,
    };

    for (const payment of payments) {
      const method = await payment.paymentMethod;
      const confirmed = await isConfirmedFn[method.type](payment as any);
      const expired = moment().isAfter(
        moment(payment.createdAt).add(this.checkTimeout[method.type])
      );

      this.logger.log(
        `Checked ${payment.id} of type ${method.type}: ${JSON.stringify({
          confirmed,
          expired,
          data: payment.data,
        })}`
      );

      if (confirmed) {
        await this.paymentRepo.update(
          { id: payment.id },
          { status: PaymentStatus.CONFIRMED, nextStatusCheckAt: null }
        );
      } else if (expired) {
        await this.paymentRepo.update(
          { id: payment.id },
          { status: PaymentStatus.FAILED, nextStatusCheckAt: null }
        );
      } else {
        const nextStatusCheckAt = moment()
          .add(this.checkInterval[method.type])
          .toDate();
        this.logger.log(
          `Next check at: ${JSON.stringify({
            paymentId: payment.id,
            nextStatusCheckAt,
          })}`
        );
        await this.paymentRepo.update(
          { id: payment.id },
          { nextStatusCheckAt }
        );
      }
    }

    this.logger.log(`Found ${payments.length} payments to check`);
  }

  public async isEthereumTxConfirmed(
    payment: Payment<PaymentMethodType.METAMASK>
  ): Promise<boolean> {
    // TODO(fant: check status of tx on eth)
    return false;
  }

  public async isSolanaTxConfirmed(
    payment: Payment<PaymentMethodType.PHANTOM>
  ): Promise<boolean> {
    // TODO(fant: check status of signature on solana)
    return false;
  }

  public async isGnosisSafeTxConfirmed(
    payment: Payment<PaymentMethodType.GNOSIS_SAFE>
  ): Promise<boolean> {
    // TODO(fant: check if safeTxHash has been published and if so what it's txHash is)
    // Also figure out how to store that txHash
    return false;
  }
}
