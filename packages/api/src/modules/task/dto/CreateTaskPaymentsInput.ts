import { PaymentData } from "@dewo/api/models/Payment";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class TaskRewardPaymentInput {
  @Field(() => GraphQLUUID)
  public userId!: string;

  @Field(() => GraphQLUUID)
  public rewardId!: string;

  @Field(() => GraphQLUUID)
  public tokenId!: string;

  @Field()
  public amount!: string;
}

@InputType()
export class CreateTaskPaymentsInput {
  @Field(() => [TaskRewardPaymentInput])
  public payments!: TaskRewardPaymentInput[];

  @Field(() => GraphQLUUID)
  public paymentMethodId!: string;

  @Field(() => GraphQLUUID)
  public networkId!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  public data!: PaymentData;
}
