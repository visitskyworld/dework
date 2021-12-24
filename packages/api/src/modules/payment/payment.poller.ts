import { Payment, PaymentStatus } from "@dewo/api/models/Payment";
import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { Response } from "express";
import { Controller, Logger, Post, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as ms from "milliseconds";
import * as solana from "@solana/web3.js";
import moment from "moment";
import { ethers } from "ethers";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../app/config";

@Controller("payment")
export class PaymentPoller {
  private logger = new Logger(this.constructor.name);
  private ethereumProviders: Record<string, ethers.providers.InfuraProvider>;

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

  private blockDepthBeforeConfirmed: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: 3,
    [PaymentMethodType.PHANTOM]: 3,
    [PaymentMethodType.GNOSIS_SAFE]: 3,
  };

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    readonly config: ConfigService<ConfigType>
  ) {
    this.ethereumProviders = {
      "ethereum-mainnet": new ethers.providers.InfuraProvider(
        "mainnet",
        config.get("INFURA_PROJECT_ID")
      ),
      "ethereum-rinkeby": new ethers.providers.InfuraProvider(
        "rinkeby",
        config.get("INFURA_PROJECT_ID")
      ),
    };
  }

  @Post("poll")
  async pollPayments(@Res() res: Response) {
    await this.poll();
    res.json({ ok: true });
  }

  public async poll(): Promise<void> {
    this.logger.log("Polling for blockchain confirmations");

    const payments = await this.paymentRepo
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.network", "network")
      .leftJoinAndSelect("p.paymentMethod", "paymentMethod")
      .where("p.status = :status", { status: PaymentStatus.PROCESSING })
      .andWhere(
        "( p.nextStatusCheckAt IS NULL OR p.nextStatusCheckAt < CURRENT_TIMESTAMP )"
      )
      .getMany();

    for (const payment of payments) {
      try {
        const method = await payment.paymentMethod;
        const confirmed = await this.isConfirmed(payment);

        const expiryTimeout = this.checkTimeout[method.type];
        const expiresAt = moment(payment.createdAt).add(expiryTimeout);
        const expired = moment().isAfter(expiresAt);

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
      } catch (error) {
        const errorString = JSON.stringify(
          error,
          Object.getOwnPropertyNames(error)
        );
        this.logger.error(
          `Error checking payment ${payment.id}: ${errorString}`
        );
      }
    }

    this.logger.log(`Found ${payments.length} payments to check`);
  }

  private async isConfirmed(payment: Payment): Promise<boolean> {
    const method = await payment.paymentMethod;
    switch (method.type) {
      case PaymentMethodType.METAMASK:
        return this.isEthereumTxConfirmed(
          payment as Payment<PaymentMethodType.METAMASK>
        );
      case PaymentMethodType.PHANTOM:
        return this.isSolanaTxConfirmed(
          payment as Payment<PaymentMethodType.PHANTOM>
        );
      case PaymentMethodType.GNOSIS_SAFE:
        return this.isGnosisSafeTxConfirmed(
          payment as Payment<PaymentMethodType.GNOSIS_SAFE>
        );
      default:
        return false;
    }
  }

  public async isEthereumTxConfirmed(
    payment: Payment<PaymentMethodType.METAMASK>
  ): Promise<boolean> {
    const network = await payment.network;
    const provider = this.ethereumProviders[network.slug];
    if (!provider) {
      this.logger.error(
        `No ethers provider for network ${network.slug} (${JSON.stringify({
          paymentId: payment.id,
          networkId: network.id,
          networkSlug: network.slug,
        })})`
      );
      return false;
    }

    const blockNumber = await provider.getBlockNumber();
    const receipt = await provider.getTransactionReceipt(payment.data.txHash);

    const depth = blockNumber - receipt.blockNumber;
    return depth >= this.blockDepthBeforeConfirmed[PaymentMethodType.METAMASK];
  }

  public async isSolanaTxConfirmed(
    payment: Payment<PaymentMethodType.PHANTOM>
  ): Promise<boolean> {
    const network = await payment.network;
    const connection = new solana.Connection(network.url);
    const status = await connection.getSignatureStatus(payment.data.signature, {
      searchTransactionHistory: true,
    });
    return status.value?.confirmationStatus === "finalized";
  }

  public async isGnosisSafeTxConfirmed(
    _payment: Payment<PaymentMethodType.GNOSIS_SAFE>
  ): Promise<boolean> {
    // TODO(fant: check if safeTxHash has been published and if so what it's txHash is)
    // Also figure out how to store that txHash
    return false;
  }
}
