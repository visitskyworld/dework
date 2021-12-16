import { UserDetailType } from "@dewo/api/models/UserDetail";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";

@InputType()
export class SetUserDetailInput {
  @Field(() => UserDetailType)
  public type!: UserDetailType;

  @Field(() => GraphQLString, { nullable: true })
  public value!: string | null;
}
