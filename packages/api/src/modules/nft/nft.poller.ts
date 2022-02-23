import {
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/api/models/PaymentMethod";
import {
  Controller,
  Logger,
  NotFoundException,
  Post,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { ethers } from "ethers";
import { ConfigType } from "../app/config";
import { PaymentService } from "../payment/payment.service";
import { NFTService } from "./nft.service";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeworkTasksV2 } from "dework-contracts/typechain";
import { abi as DeworkTasksABI } from "dework-contracts/artifacts/contracts/DeworkTasksV2.sol/DeworkTasksV2.json";
import { ThreepidSource } from "@dewo/api/models/Threepid";

@Controller("nfts")
export class NFTPoller {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly service: NFTService,
    private readonly paymentService: PaymentService,
    private readonly config: ConfigService<ConfigType>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>
  ) {}

  @Post("update")
  public async updateNfts(@Res() res: Response) {
    const result = await this.poll();
    res.json({ ok: true, result });
  }

  public async poll(): Promise<{ taskId: string } | undefined> {
    const startedAt = new Date();
    this.logger.log(
      `Polling for tasks to mint: ${JSON.stringify({ startedAt })}`
    );

    const minter = await this.getMinter();

    const task = await this.service.findNextTaskToMint();
    if (!!task) {
      this.logger.debug(`Minting NFTs for task: ${JSON.stringify(task)}`);

      for (let i = 0; i < task.assignees.length; i++) {
        const assignee = task.assignees[i];
        const [threepids, pms] = await Promise.all([
          assignee.threepids,
          assignee.paymentMethods,
        ]);
        const threepidAddress = threepids.find(
          (t) => t.source === ThreepidSource.metamask
        )?.threepid;
        const paymentMethodAddress = pms.find(
          (pm) => !pm.deletedAt && pm.type === PaymentMethodType.METAMASK
        )?.address;
        const address = threepidAddress ?? paymentMethodAddress;

        if (!address) {
          this.logger.warn(
            `Cannot mint NFT - assignee has no Metamask address: ${JSON.stringify(
              { assigneeId: assignee.id }
            )}`
          );
          continue;
        }

        const tokenId = await this.service.getNextTokenId();
        this.logger.debug(
          `Next tokenId: ${JSON.stringify({
            tokenId,
            threepidAddress,
            paymentMethodAddress,
            contractAddress: minter.contractAddress,
          })}`
        );

        const contract = new ethers.Contract(
          minter.contractAddress,
          DeworkTasksABI,
          minter.signer
        ) as ethers.Contract & DeworkTasksV2;

        const feeData = await minter.signer.provider!.getFeeData();
        this.logger.debug(
          `Network data: ${JSON.stringify({
            feeData,
            config: minter.network.config,
          })}`
        );
        const tx = await contract.mint(address, tokenId, true, {
          gasLimit: 200000,
          maxFeePerGas: feeData.gasPrice?.mul(2),
          maxPriorityFeePerGas: feeData.gasPrice?.mul(2),
        });
        this.logger.debug(`Minted NFT with tx: ${JSON.stringify(tx)}`);
        // await tx.wait(2);
        const payment = await this.paymentService.create(
          minter.paymentMethod,
          minter.network.id,
          { txHash: tx.hash }
        );
        const nft = await this.service.create({
          paymentId: payment.id,
          tokenId,
          contractAddress: minter.contractAddress,
          contractId: minter.contractId,
          taskId: task.id,
          slug: String(tokenId),
          assigneeId: assignee.id,
          ownerId: task.ownerId,
        });

        this.logger.debug(`Stored NFT in DB: ${JSON.stringify(nft)}`);
      }
    } else {
      this.logger.debug("No task to mint found");
    }

    this.logger.log(
      `Polled for tasks to mint: ${JSON.stringify({ startedAt })}`
    );

    if (!!task) return { taskId: task.id };
    return undefined;
  }

  private async getMinter(): Promise<{
    network: PaymentNetwork;
    paymentMethod: PaymentMethod;
    contractAddress: string;
    contractId: string;
    signer: ethers.Signer;
  }> {
    const privateKey = this.config.get("NFT_MINTER_PRIVATE_KEY");
    const networkSlug = this.config.get("NFT_MINTER_NETWORK");
    const contractAddress = this.config.get("NFT_CONTRACT_ADDRESS");
    const contractId = this.config.get("NFT_CONTRACT_ID");

    const network = await this.paymentService.findPaymentNetwork({
      slug: networkSlug,
    });
    if (!network) {
      throw new NotFoundException(`Payment network not found: ${networkSlug}`);
    }

    const provider = new ethers.providers.JsonRpcProvider(
      network.config.rpcUrl
    );
    const signer = new ethers.Wallet(privateKey, provider);

    const paymentMethod = await this.paymentMethodRepo
      .createQueryBuilder("pm")
      .innerJoinAndSelect("pm.networks", "n")
      .where("n.id = :networkId", { networkId: network.id })
      .andWhere("pm.address = :address", { address: signer.address })
      .andWhere("pm.type = :type", { type: PaymentMethodType.METAMASK })
      .getOne();
    if (!paymentMethod) {
      throw new NotFoundException(
        `Payment method not found: ${PaymentMethodType.METAMASK}`
      );
    }

    return {
      network,
      paymentMethod,
      contractAddress,
      contractId,
      signer,
    };
  }
}
