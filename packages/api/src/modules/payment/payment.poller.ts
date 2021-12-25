import {
  GnosisSafePaymentData,
  MetamaskPaymentData,
  Payment,
  PaymentStatus,
  PhantomPaymentData,
} from "@dewo/api/models/Payment";
import {
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/api/models/PaymentMethod";
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
import Safe, { EthersAdapter } from "@gnosis.pm/safe-core-sdk";
import { ConfigType } from "../app/config";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";

@Controller("payment")
export class PaymentPoller {
  private logger = new Logger(this.constructor.name);
  private ethereumProviders: Record<string, ethers.providers.InfuraProvider>;
  private gnosisSafeServiceClients: Record<string, SafeServiceClient>;

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

        // if (confirmed) {
        //   await this.paymentRepo.save({
        //     ...payment,
        //     status: PaymentStatus.CONFIRMED,
        //     nextStatusCheckAt: null,
        //   });
        // } else if (expired) {
        //   await this.paymentRepo.save({
        //     ...payment,
        //     status: PaymentStatus.FAILED,
        //     nextStatusCheckAt: null,
        //   });
        // } else {
        //   const nextStatusCheckAt = moment()
        //     .add(this.checkInterval[method.type])
        //     .toDate();
        //   this.logger.log(
        //     `Next check at: ${JSON.stringify({
        //       paymentId: payment.id,
        //       nextStatusCheckAt,
        //     })}`
        //   );
        //   await this.paymentRepo.save({ ...payment, nextStatusCheckAt });
        // }
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
    const [method, network] = await Promise.all([
      payment.paymentMethod,
      payment.network,
    ]);
    switch (method.type) {
      case PaymentMethodType.METAMASK:
        return this.isEthereumTxConfirmed(
          payment.data as MetamaskPaymentData,
          network
        );
      case PaymentMethodType.PHANTOM:
        return this.isSolanaTxConfirmed(
          payment.data as PhantomPaymentData,
          network
        );
      case PaymentMethodType.GNOSIS_SAFE:
        return this.isGnosisSafeTxConfirmed(
          payment.data as GnosisSafePaymentData,
          method,
          network
        );
      default:
        return false;
    }
  }

  public async isEthereumTxConfirmed(
    data: MetamaskPaymentData,
    network: PaymentNetwork
  ): Promise<boolean> {
    const provider = this.ethereumProviders[network.slug];
    if (!provider) {
      this.logger.error(
        `No ethers provider for network ${network.slug} (${JSON.stringify({
          networkId: network.id,
          networkSlug: network.slug,
        })})`
      );
      return false;
    }

    const blockNumber = await provider.getBlockNumber();
    const receipt = await provider.getTransactionReceipt(data.txHash);
    this.logger.debug(
      `Ethereum transaction receipt: ${JSON.stringify({ data, receipt })}`
    );

    const depth = blockNumber - receipt.blockNumber;
    return depth >= this.blockDepthBeforeConfirmed[PaymentMethodType.METAMASK];
  }

  public async isSolanaTxConfirmed(
    data: PhantomPaymentData,
    network: PaymentNetwork
  ): Promise<boolean> {
    const connection = new solana.Connection(network.url);
    const status = await connection.getSignatureStatus(data.signature, {
      searchTransactionHistory: true,
    });
    this.logger.debug(
      `Solana signature status: ${JSON.stringify({ data, status })}`
    );
    return status.value?.confirmationStatus === "finalized";
  }

  public async isGnosisSafeTxConfirmed(
    data: GnosisSafePaymentData,
    paymentMethod: PaymentMethod,
    network: PaymentNetwork
  ): Promise<{
    confirmed: boolean;
    txHash?: string;
  }> {
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

    const signer = ethers.Wallet.createRandom().connect(provider);
    const ethAdapter = new EthersAdapter({ ethers, signer });
    const safeAddress = paymentMethod.address;

    const safe = await Safe.create({ ethAdapter, safeAddress });
    const safeTx = await safeService.getTransaction(data.safeTxHash);

    if (!safeTx.transactionHash) return { confirmed: false };
    const confirmed = await this.isEthereumTxConfirmed(
      { txHash: safeTx.transactionHash },
      network
    );
    return { confirmed, txHash: safeTx.transactionHash };
  }
}
