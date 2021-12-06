import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { PaymentService } from "./payment.service";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { CreatePaymentMethodInput } from "./dto/CreatePaymentMethodInput";
import { AuthGuard } from "../auth/guards/auth.guard";

@Injectable()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentMethod)
  @UseGuards(AuthGuard)
  public async createPaymentMethod(
    @Context("user") user: User,
    @Args("input") input: CreatePaymentMethodInput
  ): Promise<PaymentMethod> {
    return this.paymentService.create(input, user);
  }
}
