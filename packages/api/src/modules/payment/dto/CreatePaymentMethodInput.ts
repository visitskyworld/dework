import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreatePaymentMethodInput {
  @Field(() => PaymentMethodType)
  public type!: PaymentMethodType;

  @Field()
  public address!: string;

  @Field(() => GraphQLUUID)
  public networkId!: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tokenIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public projectId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public userId?: string;
}
