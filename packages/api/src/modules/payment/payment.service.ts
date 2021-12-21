import { Payment, PaymentStatus } from "@dewo/api/models/Payment";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { AtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
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
    partial: Pick<Payment, "paymentMethodId" | "data">
  ): Promise<Payment> {
    /*
    switch (data.from.type) {
      case PaymentMethodType.GNOSIS_SAFE:
        if (!(data.data as GnosisSafePaymentData).safeTxHash) {
          throw new Error(
            `Cannot create ${PaymentMethodType.METAMASK} payment without data.safeTxHash`
          );
        }
        break;
      case PaymentMethodType.METAMASK:
      case PaymentMethodType.PHANTOM:
        if (!data.txHash) {
          throw new Error(
            `Cannot create ${PaymentMethodType.METAMASK} payment without txHash`
          );
        }
        break;
    }

    const created = await this.paymentRepo.save({
      fromId: data.from.id,
      toId: data.to.id,
      data: data.data,
      txHash: data.txHash,
      // TODO: fetch depending on payment method
      status: PaymentStatus.PROCESSING,
    });
    return this.findById(created.id) as Promise<Payment>;
    */

    const created = await this.paymentRepo.save({
      status: PaymentStatus.PROCESSING,
      ...partial,
    });
    return this.findById(created.id) as Promise<Payment>;
  }

  public async createPaymentMethod(
    input: CreatePaymentMethodInput,
    user: User
  ): Promise<PaymentMethod> {
    const [tokens, networks] = await Promise.all([
      this.paymentTokenRepo.find({ id: In(input.tokenIds) }),
      this.paymentNetworkRepo.find({ id: input.networkId }),
    ]);

    const pm = new PaymentMethod();
    pm.type = input.type;
    pm.address = input.address;
    pm.projectId = input.projectId;
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
    partial: AtLeast<PaymentNetwork, "name" | "url">
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
    return this.paymentNetworkRepo.find();
  }
}
