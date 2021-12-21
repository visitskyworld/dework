import { Payment, PaymentStatus } from "@dewo/api/models/Payment";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { AtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

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
    partial: DeepPartial<PaymentMethod>,
    user: User
  ): Promise<PaymentMethod> {
    const created = await this.paymentMethodRepo.save({
      ...partial,
      creatorId: user.id,
    });
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

  public async getPaymentNetworks(): Promise<PaymentNetwork[]> {
    return this.paymentNetworkRepo.find();
  }
}
