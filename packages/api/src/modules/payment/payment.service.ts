import {
  GnosisSafePaymentData,
  MetamaskPaymentData,
  Payment,
  PaymentData,
  PaymentStatus,
  PhantomPaymentData,
} from "@dewo/api/models/Payment";
import {
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/api/models/PaymentMethod";
import { ethers } from "ethers";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { PaymentToken, PaymentTokenType } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { AtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, In, IsNull, Repository } from "typeorm";
import { CreatePaymentMethodInput } from "./dto/CreatePaymentMethodInput";
import { PriceService } from "./price.service";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(PaymentNetwork)
    private readonly paymentNetworkRepo: Repository<PaymentNetwork>,
    @InjectRepository(PaymentToken)
    private readonly paymentTokenRepo: Repository<PaymentToken>,
    private readonly priceService: PriceService
  ) {}

  public async create(
    paymentMethod: PaymentMethod,
    networkId: string,
    data: PaymentData,
    override: DeepPartial<Payment> = {}
  ): Promise<Payment> {
    switch (paymentMethod.type) {
      case PaymentMethodType.GNOSIS_SAFE:
        if (!(data as GnosisSafePaymentData).safeTxHash) {
          throw new Error(
            `Cannot create Gnosis Safe payment without safeTxHash`
          );
        }
        break;
      case PaymentMethodType.METAMASK:
        if (!(data as MetamaskPaymentData).txHash) {
          throw new Error(`Cannot create Metamask payment without txHash`);
        }
        break;
      case PaymentMethodType.PHANTOM:
        if (!(data as PhantomPaymentData).signature) {
          throw new Error(`Cannot create Phantom payment without signature`);
        }
        break;
    }

    const created = await this.paymentRepo.save({
      ...override,
      data,
      networkId,
      paymentMethodId: paymentMethod.id,
      status: PaymentStatus.PROCESSING,
    });
    return this.findById(created.id) as Promise<Payment>;
  }

  public async createPaymentMethod(
    input: CreatePaymentMethodInput,
    user: User
  ): Promise<PaymentMethod> {
    const created = await this.batchCreatePaymentMethods([
      { ...input, creatorId: user.id },
    ]);
    return created[0];
  }

  public async batchCreatePaymentMethods(
    partials: Partial<PaymentMethod>[]
  ): Promise<PaymentMethod[]> {
    const created = await this.paymentMethodRepo.save(partials);
    return this.paymentMethodRepo.find({ id: In(created.map((c) => c.id)) });
  }

  public async updatePaymentMethod(
    partial: AtLeast<PaymentMethod, "id">
  ): Promise<PaymentMethod> {
    const updated = await this.paymentMethodRepo.save(partial);
    return this.paymentMethodRepo.findOne(updated.id) as Promise<PaymentMethod>;
  }

  public async findById(id: string): Promise<Payment | undefined> {
    return this.paymentRepo.findOne(id);
  }

  public async findPaymentMethodById(
    id: string
  ): Promise<PaymentMethod | undefined> {
    return this.paymentMethodRepo.findOne(id);
  }

  public async findPaymentMethod(
    query: DeepPartial<PaymentMethod>
  ): Promise<PaymentMethod | undefined> {
    return this.paymentMethodRepo.findOne({ where: query });
  }

  public async findPaymentNetwork(
    query: DeepPartial<PaymentNetwork>
  ): Promise<PaymentNetwork | undefined> {
    return this.paymentNetworkRepo.findOne({ where: query });
  }

  public async createPaymentNetwork(
    partial: AtLeast<PaymentNetwork, "name" | "type" | "config">
  ): Promise<PaymentNetwork> {
    const created = await this.paymentNetworkRepo.save({
      sortKey: Date.now().toString(),
      ...partial,
    });
    return this.paymentNetworkRepo.findOne(
      created.id
    ) as Promise<PaymentNetwork>;
  }

  public async createPaymentToken(
    partial: AtLeast<PaymentToken, "type" | "name" | "symbol" | "networkId">
  ): Promise<PaymentToken> {
    const address = !!partial.address
      ? this.formatTokenAddress(partial.type, partial.address)
      : undefined;
    const existing = await this.paymentTokenRepo.findOne({
      type: partial.type,
      networkId: partial.networkId,
      address: address ?? IsNull(),
      identifier: partial.identifier ?? IsNull(),
    });
    const usdPrice =
      !!address && partial.type === PaymentTokenType.ERC20
        ? await this.priceService.lookupERC20TokenPrice(address)
        : undefined;

    if (!!existing) {
      if (!!usdPrice) {
        await this.paymentTokenRepo.update({ id: existing.id }, { usdPrice });
        existing.usdPrice = usdPrice;
      }
      return existing;
    }

    const created = await this.paymentTokenRepo.save({
      exp: 0,
      ...partial,
      address,
      usdPrice,
    });
    return this.paymentTokenRepo.findOne(created.id) as Promise<PaymentToken>;
  }

  public async getPaymentNetworks(
    query: Partial<PaymentNetwork> = {}
  ): Promise<PaymentNetwork[]> {
    return this.paymentNetworkRepo.find({
      where: query,
      order: { sortKey: "ASC" },
    });
  }

  private formatTokenAddress(type: PaymentTokenType, address: string): string {
    switch (type) {
      case PaymentTokenType.ERC20:
      case PaymentTokenType.ERC1155:
        return ethers.utils.getAddress(address);
      default:
        return address;
    }
  }
}
