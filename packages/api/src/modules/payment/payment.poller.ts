import {
  GnosisSafePaymentData,
  MetamaskPaymentData,
  Payment,
  PaymentData,
  PaymentStatus,
  PhantomPaymentData,
} from "@dewo/api/models/Payment";
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
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { ConfigType } from "../app/config";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";

interface ConfirmPaymentResponse {
  confirmed: boolean;
  data?: Partial<PaymentData>;
}

@Controller("payment")
export class PaymentPoller {
  private logger = new Logger(this.constructor.name);
  private ethereumProviders: Record<string, ethers.providers.InfuraProvider>;
  private gnosisSafeServiceClients: Record<string, SafeServiceClient>;

  private checkInterval: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: ms.minutes(1),
    [PaymentMethodType.PHANTOM]: ms.seconds(10),
    [PaymentMethodType.GNOSIS_SAFE]: ms.minutes(1),
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
    this.gnosisSafeServiceClients = {
      "ethereum-mainnet": new SafeServiceClient(
        "https://safe-transaction.gnosis.io"
      ),
      "ethereum-rinkeby": new SafeServiceClient(
        "https://safe-transaction.rinkeby.gnosis.io"
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

    this.logger.log(`Found ${payments.length} payments to check`);

    for (const payment of payments) {
      try {
        const method = await payment.paymentMethod;
        const confirmation = await this.isConfirmed(payment);

        const expiryTimeout = this.checkTimeout[method.type];
        const expiresAt = moment(payment.createdAt).add(expiryTimeout);
        const expired = moment().isAfter(expiresAt);

        this.logger.log(
          `Checked ${payment.id} of type ${method.type}: ${JSON.stringify({
            expired,
            confirmation,
            data: payment.data,
          })}`
        );

        if (confirmation.confirmed) {
          await this.paymentRepo.save({
            ...payment,
            data: { ...payment.data, ...confirmation.data },
            status: PaymentStatus.CONFIRMED,
            nextStatusCheckAt: null,
          });
        } else if (expired) {
          await this.paymentRepo.save({
            ...payment,
            data: { ...payment.data, ...confirmation.data },
            status: PaymentStatus.FAILED,
            nextStatusCheckAt: null,
          });
        } else {
          const nextStatusCheckAt = await this.getNextStatusCheckAt(payment);
          this.logger.log(
            `Next check at: ${JSON.stringify({
              paymentId: payment.id,
              nextStatusCheckAt,
            })}`
          );
          await this.paymentRepo.save({
            ...payment,
            data: { ...payment.data, ...confirmation.data },
            nextStatusCheckAt,
          });
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
  }

  private async isConfirmed(payment: Payment): Promise<ConfirmPaymentResponse> {
    const [method, network] = await Promise.all([
      payment.paymentMethod,
      payment.network,
    ]);

    switch (method.type) {
      case PaymentMethodType.PHANTOM:
        return this.isSolanaTxConfirmed(
          payment.data as PhantomPaymentData,
          network
        );
      case PaymentMethodType.METAMASK:
      case PaymentMethodType.GNOSIS_SAFE:
        const data = payment.data as
          | GnosisSafePaymentData
          | MetamaskPaymentData;
        if (data.txHash) {
          return this.isEthereumTxConfirmed(
            data as MetamaskPaymentData,
            network
          );
        }
        return this.isGnosisSafeTxConfirmed(
          data as GnosisSafePaymentData,
          network
        );
      default:
        return { confirmed: false };
    }
  }

  private async getNextStatusCheckAt(payment: Payment): Promise<Date> {
    const method = await payment.paymentMethod;
    switch (method.type) {
      case PaymentMethodType.PHANTOM:
      case PaymentMethodType.METAMASK:
        return moment().add(this.checkInterval[method.type]).toDate();
      case PaymentMethodType.GNOSIS_SAFE:
        if (!!(payment.data as GnosisSafePaymentData).txHash) {
          return moment()
            .add(this.checkInterval[PaymentMethodType.METAMASK])
            .toDate();
        }

        return moment()
          .add(this.checkInterval[PaymentMethodType.GNOSIS_SAFE])
          .toDate();
    }
  }

  public async isEthereumTxConfirmed(
    data: MetamaskPaymentData,
    network: PaymentNetwork
  ): Promise<ConfirmPaymentResponse> {
    const provider = this.ethereumProviders[network.slug];
    if (!provider) {
      this.logger.error(
        `No ethers provider for network ${network.slug} (${JSON.stringify({
          networkId: network.id,
          networkSlug: network.slug,
        })})`
      );
      return { confirmed: false };
    }

    const blockNumber = await provider.getBlockNumber();
    const receipt = await provider.getTransactionReceipt(data.txHash);

    const depth = blockNumber - receipt.blockNumber;
    const confirmed =
      depth >= this.blockDepthBeforeConfirmed[PaymentMethodType.METAMASK];
    this.logger.debug(
      `Ethereum transaction receipt: ${JSON.stringify({
        data,
        receipt,
        depth,
        blockNumber,
      })}`
    );
    return { confirmed };
  }

  public async isSolanaTxConfirmed(
    data: PhantomPaymentData,
    network: PaymentNetwork
  ): Promise<ConfirmPaymentResponse> {
    const connection = new solana.Connection(network.url);
    const status = await connection.getSignatureStatus(data.signature, {
      searchTransactionHistory: true,
    });
    this.logger.debug(
      `Solana signature status: ${JSON.stringify({ data, status })}`
    );
    const confirmed = status.value?.confirmationStatus === "finalized";
    return { confirmed };
  }

  public async isGnosisSafeTxConfirmed(
    data: GnosisSafePaymentData,
    network: PaymentNetwork
  ): Promise<ConfirmPaymentResponse> {
    const safeService = this.gnosisSafeServiceClients[network.slug];
    if (!safeService) {
      this.logger.error(
        `No Gnosis Safe Service client for network ${
          network.slug
        } (${JSON.stringify({
          networkId: network.id,
          networkSlug: network.slug,
        })})`
      );
      return { confirmed: false };
    }

    const provider = this.ethereumProviders[network.slug];
    if (!provider) {
      this.logger.error(
        `No ethers provider for network ${network.slug} (${JSON.stringify({
          networkId: network.id,
          networkSlug: network.slug,
        })})`
      );
      return { confirmed: false };
    }

    const safeTx = await safeService.getTransaction(data.safeTxHash);
    if (!safeTx.transactionHash) return { confirmed: false };
    const confirmed = await this.isEthereumTxConfirmed(
      { txHash: safeTx.transactionHash },
      network
    ).then((res) => res.confirmed);
    return { confirmed, data: { txHash: safeTx.transactionHash } };
  }
}
