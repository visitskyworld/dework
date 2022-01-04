import { EntityDetailType } from "@dewo/api/models/EntityDetail";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";

@InputType()
export class SetUserDetailInput {
  @Field(() => EntityDetailType)
  public type!: EntityDetailType;

  @Field(() => GraphQLString, { nullable: true })
  public value!: string | null;
}
