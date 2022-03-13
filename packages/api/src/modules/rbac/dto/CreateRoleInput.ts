import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateRoleInput {
  @Field()
  public name!: string;

  @Field()
  public color!: string;

  @Field({ nullable: true })
  public default?: boolean;

  @Field(() => GraphQLUUID)
  public organizationId!: string;
}
