import { UserDetailKey } from "@dewo/api/models/UserDetail";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLString } from "graphql";

@InputType()
export class CreateUserDetailInput {
  @Field(() => UserDetailKey)
  public type!: UserDetailKey;

  @Field(() => GraphQLString)
  public value!: string;
}
