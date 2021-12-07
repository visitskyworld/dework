import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  public username?: string;

  @Field({ nullable: true })
  public bio?: string;

  @Field({ nullable: true })
  public imageUrl?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public paymentMethodId?: string;
}
