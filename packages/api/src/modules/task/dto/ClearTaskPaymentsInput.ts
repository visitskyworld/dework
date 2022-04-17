import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class ClearTaskPaymentsInput {
  @Field(() => GraphQLUUID)
  public paymentId!: string;
}
