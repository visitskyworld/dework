import { PaymentData } from "@dewo/api/models/Payment";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskPaymentsInput {
  @Field(() => [GraphQLUUID])
  public taskRewardIds!: string[];

  @Field(() => GraphQLUUID)
  public paymentMethodId!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  public data!: PaymentData;
}
