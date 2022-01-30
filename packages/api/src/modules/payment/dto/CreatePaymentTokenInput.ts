import { PaymentTokenType } from "@dewo/api/models/PaymentToken";
import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreatePaymentTokenInput {
  @Field(() => PaymentTokenType)
  public type!: PaymentTokenType;

  @Field()
  public address!: string;

  @Field({ nullable: true })
  public tokenId?: string;

  @Field()
  public name!: string;

  @Field()
  public symbol!: string;

  @Field(() => Int)
  public exp!: number;

  @Field(() => GraphQLUUID)
  public networkId!: string;
}
