import { UserDetailType } from "@dewo/api/models/UserDetail";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SetUserDetailInput {
  @Field(() => UserDetailType)
  public type!: UserDetailType;

  @Field({ nullable: true })
  public value?: string;
}
