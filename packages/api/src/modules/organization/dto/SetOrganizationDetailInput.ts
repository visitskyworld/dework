import { EntityDetailType } from "@dewo/api/models/EntityDetail";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class SetOrganizationDetailInput {
  @Field(() => EntityDetailType)
  public type!: EntityDetailType;

  @Field(() => GraphQLString, { nullable: true })
  public value!: string | null;

  @Field(() => GraphQLUUID)
  public organizationId!: string;
}
