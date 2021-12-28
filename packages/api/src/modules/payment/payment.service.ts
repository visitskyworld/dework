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
import { DeepPartial, In, Repository } from "typeorm";
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
      this.paymentNetworkRepo.find({ id: input.networkId }),
    ]);

    const pm = new PaymentMethod();
    pm.type = input.type;
    pm.address = input.address;
    pm.projectId = input.projectId;
    pm.userId = input.userId;
    // @ts-ignore
    pm.tokens = tokens;
    // @ts-ignore
    pm.networks = networks;
    pm.creatorId = user.id;

    const created = await this.paymentMethodRepo.save(pm);
    return this.findPaymentMethodById(created.id) as Promise<PaymentMethod>;
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
    partial: AtLeast<PaymentToken, "type" | "name" | "networkId">
  ): Promise<PaymentToken> {
    const created = await this.paymentTokenRepo.save({ exp: 1, ...partial });
    return this.paymentTokenRepo.findOne(created.id) as Promise<PaymentToken>;
  }

  public async getPaymentNetworks(): Promise<PaymentNetwork[]> {
    return this.paymentNetworkRepo.find({ order: { sortKey: "ASC" } });
  }
}
