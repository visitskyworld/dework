import {
  GnosisSafePaymentData,
  MetamaskPaymentData,
  Payment,
  PaymentData,
  PaymentStatus,
  PhantomPaymentData,
  StacksPaymentData,
} from "@dewo/api/models/Payment";
import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { Controller, Logger, Post, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as ms from "milliseconds";
import * as solana from "@solana/web3.js";
import moment from "moment";
import { ethers } from "ethers";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import {
  PaymentNetwork,
  PaymentNetworkType,
} from "@dewo/api/models/PaymentNetwork";
import * as request from "request-promise";
import { Response } from "express";
import { EventBus } from "@nestjs/cqrs";
import { PaymentConfirmedEvent } from "./payment.events";
import { TaskRewardPayment } from "@dewo/api/models/TaskRewardPayment";

interface ConfirmPaymentResponse {
  confirmed: boolean;
  data?: Partial<PaymentData>;
}

@Controller("payments")
export class PaymentPoller {
  private logger = new Logger(this.constructor.name);

  private checkInterval: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: ms.seconds(5),
    [PaymentMethodType.PHANTOM]: ms.seconds(5),
    [PaymentMethodType.GNOSIS_SAFE]: ms.minutes(5),
    [PaymentMethodType.HIRO]: ms.minutes(1),
  };

  private checkTimeout: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: ms.minutes(30),
    [PaymentMethodType.PHANTOM]: ms.minutes(10),
    [PaymentMethodType.GNOSIS_SAFE]: ms.days(14),
    [PaymentMethodType.HIRO]: ms.hours(2),
  };

  private blockDepthBeforeConfirmed: Record<PaymentMethodType, number> = {
    [PaymentMethodType.METAMASK]: 1,
    [PaymentMethodType.PHANTOM]: 1,
    [PaymentMethodType.GNOSIS_SAFE]: 1,
    [PaymentMethodType.HIRO]: 0,
  };

  constructor(
    @InjectRepository(TaskRewardPayment)
    private readonly taskRewardPaymentRepo: Repository<TaskRewardPayment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly eventBus: EventBus
  ) {}

  @Post("update")
  public async updatePrices(@Res() res: Response) {
    await this.poll();
    res.json({ ok: true });
  }
  // @Interval(20000)
  // async cron() {
  //   await this.poll();
  // }

  public async poll(): Promise<void> {
    const startedAt = new Date();
    this.logger.log(
      `Polling for blockchain confirmations: ${JSON.stringify({ startedAt })}`
    );

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
            expiryTimeout,
            confirmation,
            data: payment.data,
          })}`
        );

        if (confirmation.confirmed) {
          const saved = await this.paymentRepo.save({
            ...payment,
            data: { ...payment.data, ...confirmation.data },
            status: PaymentStatus.CONFIRMED,
            nextStatusCheckAt: null,
          });
          const taskRewardPayment = await this.taskRewardPaymentRepo.findOne({
            paymentId: payment.id,
          });
          const task = await taskRewardPayment?.reward.task;

          this.eventBus.publish(new PaymentConfirmedEvent(saved, task));
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

    this.logger.log(
      `Polled for blockchain confirmations: ${JSON.stringify({ startedAt })}`
    );
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
          network as PaymentNetwork<PaymentNetworkType.SOLANA>
        );
      case PaymentMethodType.HIRO:
        return this.isStacksTxConfirmed(
          payment.data as StacksPaymentData,
          network as PaymentNetwork<PaymentNetworkType.STACKS>
        );
      case PaymentMethodType.METAMASK:
      case PaymentMethodType.GNOSIS_SAFE:
        const data = payment.data as
          | GnosisSafePaymentData
          | MetamaskPaymentData;
        if (data.txHash) {
          return this.isEthereumTxConfirmed(
            data as MetamaskPaymentData,
            network as PaymentNetwork<PaymentNetworkType.ETHEREUM>
          );
        }
        return this.isGnosisSafeTxConfirmed(
          data as GnosisSafePaymentData,
          network as PaymentNetwork<PaymentNetworkType.ETHEREUM>
        );
      default:
        return { confirmed: false };
    }
  }

  private async getNextStatusCheckAt(payment: Payment): Promise<Date> {
    const method = await payment.paymentMethod;
    switch (method.type) {
      case PaymentMethodType.GNOSIS_SAFE:
        if (!!(payment.data as GnosisSafePaymentData).txHash) {
          return moment()
            .add(this.checkInterval[PaymentMethodType.METAMASK])
            .toDate();
        }

        return moment()
          .add(this.checkInterval[PaymentMethodType.GNOSIS_SAFE])
          .toDate();
      default:
        return moment().add(this.checkInterval[method.type]).toDate();
    }
  }

  public async isEthereumTxConfirmed(
    data: MetamaskPaymentData,
    network: PaymentNetwork<PaymentNetworkType.ETHEREUM>
  ): Promise<ConfirmPaymentResponse> {
    const provider = new ethers.providers.JsonRpcProvider(
      network.config.rpcUrl
    );
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

    if (!receipt) {
      this.logger.debug(
        `Ethereum transaction receipt not found: ${JSON.stringify({
          txHash: data.txHash,
        })}`
      );
      return { confirmed: false };
    }

    const depth = blockNumber - receipt.blockNumber;
    const confirmed =
      receipt.status === 1 &&
      depth >= this.blockDepthBeforeConfirmed[PaymentMethodType.METAMASK];
    this.logger.debug(
      `Ethereum transaction receipt: ${JSON.stringify({
        data,
        receipt,
        depth,
        blockNumber,
        status: receipt.status,
      })}`
    );
    return { confirmed };
  }

  public async isSolanaTxConfirmed(
    data: PhantomPaymentData,
    network: PaymentNetwork<PaymentNetworkType.SOLANA>
  ): Promise<ConfirmPaymentResponse> {
    const connection = new solana.Connection(network.config.rpcUrl);
    const status = await connection.getSignatureStatus(data.signature, {
      searchTransactionHistory: true,
    });
    this.logger.debug(
      `Solana signature status: ${JSON.stringify({ data, status })}`
    );
    const confirmed = status.value?.confirmationStatus === "finalized";
    return { confirmed };
  }

  public async isStacksTxConfirmed(
    data: StacksPaymentData,
    network: PaymentNetwork<PaymentNetworkType.STACKS>
  ): Promise<ConfirmPaymentResponse> {
    const url = `${network.config.rpcUrl}/extended/v1/tx/${data.txId}`;
    const res = await request.get({ url, json: true });
    return { confirmed: res.tx_status === "success" };
  }

  public async isGnosisSafeTxConfirmed(
    data: GnosisSafePaymentData,
    network: PaymentNetwork<PaymentNetworkType.ETHEREUM>
  ): Promise<ConfirmPaymentResponse> {
    if (!network.config.gnosisSafe) {
      return { confirmed: false };
    }

    const safeService = new SafeServiceClient(
      network.config.gnosisSafe.serviceUrl
    );
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

    const safeTx = await safeService.getTransaction(data.safeTxHash);
    if (!safeTx.transactionHash) {
      this.logger.debug(
        `Gnosis Safe Transaction has no transactionHash (${JSON.stringify(
          data
        )})`
      );
      return { confirmed: false };
    }

    this.logger.debug(
      `Gnosis Safe Transaction has transactionHash (${JSON.stringify({
        ...data,
        txHash: safeTx.transactionHash,
      })})`
    );
    const confirmed = await this.isEthereumTxConfirmed(
      { txHash: safeTx.transactionHash },
      network
    ).then((res) => res.confirmed);
    return { confirmed, data: { txHash: safeTx.transactionHash } };
  }
}
