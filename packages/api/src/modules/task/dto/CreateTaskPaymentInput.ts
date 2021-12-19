import { PaymentData } from "@dewo/api/models/Payment";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskPaymentInput {
  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field({ nullable: true })
  public txHash?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  public data!: PaymentData;
}
