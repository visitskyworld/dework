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
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { AtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, In, IsNull, Repository } from "typeorm";
import { CreatePaymentMethodInput } from "./dto/CreatePaymentMethodInput";

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
    private readonly paymentTokenRepo: Repository<PaymentToken>
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
    const [tokens, networks] = await Promise.all([
      !!input.tokenIds?.length
        ? this.paymentTokenRepo.find({ id: In(input.tokenIds) })
        : ([] as PaymentToken[]),
      this.paymentNetworkRepo.find({ id: In(input.networkIds) }),
    ]);

    const created = await this.batchCreatePaymentMethods([
      { ...input, networks, tokens, creatorId: user.id },
    ]);
    return created[0];
  }

  public async batchCreatePaymentMethods(
    partials: Partial<
      Omit<PaymentMethod, "networks" | "tokens"> & {
        networks: PaymentNetwork[];
        tokens: PaymentToken[];
      }
    >[]
  ): Promise<PaymentMethod[]> {
    const processed = partials.map((pm) =>
      Object.assign(new PaymentMethod(), pm)
    );
    const created = await this.paymentMethodRepo.save(processed);
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
    const existing = await this.paymentTokenRepo.findOne({
      type: partial.type,
      networkId: partial.networkId,
      address: partial.address ?? IsNull(),
      identifier: partial.identifier ?? IsNull(),
    });
    if (!!existing) return existing;

    const created = await this.paymentTokenRepo.save({ exp: 0, ...partial });
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
}
