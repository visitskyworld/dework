import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateOrganizationTagInput {
  @Field()
  public label!: string;

  @Field()
  public color!: string;

  @Field(() => GraphQLUUID)
  public organizationId!: string;
}
