import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdatePaymentMethodInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field(() => Date)
  public deletedAt?: Date;
}
