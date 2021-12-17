import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateProjectInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public paymentMethodId?: string;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
