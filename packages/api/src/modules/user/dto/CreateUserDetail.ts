import { UserDetailType } from "@dewo/api/models/UserDetail";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";

@InputType()
export class CreateUserDetailInput {
  @Field(() => UserDetailType)
  public type!: UserDetailType;

  @Field(() => GraphQLString)
  public value!: string;
}
