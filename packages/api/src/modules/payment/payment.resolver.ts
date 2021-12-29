import { Args, Context, Mutation, Query } from "@nestjs/graphql";
import { ForbiddenException, Injectable, UseGuards } from "@nestjs/common";
import { User } from "@dewo/api/models/User";
import { PaymentService } from "./payment.service";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { CreatePaymentMethodInput } from "./dto/CreatePaymentMethodInput";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { UpdatePaymentMethodInput } from "./dto/UpdatePaymentMethodInput";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { CreatePaymentTokenInput } from "./dto/CreatePaymentTokenInput";

@Injectable()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentMethod)
  @UseGuards(AuthGuard)
  public async createPaymentMethod(
    @Context("user") user: User,
    @Args("input") input: CreatePaymentMethodInput
  ): Promise<PaymentMethod> {
    // TODO(fant): add a unit test for this
    if (!!input.userId && input.userId !== user.id) {
      throw new ForbiddenException();
    }
    return this.paymentService.createPaymentMethod(input, user);
  }

  @Mutation(() => PaymentToken)
  @UseGuards(AuthGuard)
  public async createPaymentToken(
    @Args("input") input: CreatePaymentTokenInput
  ): Promise<PaymentToken> {
    return this.paymentService.createPaymentToken(input);
  }

  @Mutation(() => PaymentMethod)
  // TODO(fant): auth
  @UseGuards(AuthGuard)
  public async updatePaymentMethod(
    @Args("input") input: UpdatePaymentMethodInput
  ): Promise<PaymentMethod> {
    return this.paymentService.updatePaymentMethod(input);
  }

  @Query(() => [PaymentNetwork])
  public async getPaymentNetworks(): Promise<PaymentNetwork[]> {
    return this.paymentService.getPaymentNetworks();
  }
}
