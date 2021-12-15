import { UserDetailType } from "@dewo/api/models/UserDetail";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserDetailInput {
  @Field(() => UserDetailType)
  public type!: UserDetailType;

  @Field()
  public value!: string;
}
