import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { User } from "@dewo/api/models/User";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>
  ) {}

  public async create(
    partial: DeepPartial<PaymentMethod>,
    user: User
  ): Promise<PaymentMethod> {
    const created = await this.paymentMethodRepo.save({
      ...partial,
      creatorId: user.id,
    });
    return this.findById(created.id) as Promise<PaymentMethod>;
  }

  public async findById(id: string): Promise<PaymentMethod | undefined> {
    return this.paymentMethodRepo.findOne(id);
  }
}
