import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateUserRoleInput {
  @Field(() => GraphQLUUID)
  public userId!: string;

  @Field(() => GraphQLUUID)
  public roleId!: string;

  @Field({ nullable: true })
  public hidden!: boolean;
}
