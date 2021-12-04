import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePaymentMethodInput {
  @Field(() => PaymentMethodType)
  public type!: PaymentMethodType;

  @Field()
  public address!: string;
}
