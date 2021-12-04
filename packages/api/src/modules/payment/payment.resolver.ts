import { Args, Context, Mutation } from "@nestjs/graphql";
import { Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { RequireGraphQLAuthGuard } from "../auth/guards/auth.guard";
import { PaymentService } from "./payment.service";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { CreatePaymentMethodInput } from "./dto/CreatePaymentMethodInput";

@Injectable()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentMethod)
  @UseGuards(RequireGraphQLAuthGuard)
  public async createPaymentMethod(
    @Context("user") user: User,
    @Args("input") input: CreatePaymentMethodInput
  ): Promise<PaymentMethod> {
    return this.paymentService.create(input, user);
  }
}
