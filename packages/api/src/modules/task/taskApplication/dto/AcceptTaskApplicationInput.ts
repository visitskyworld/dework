import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class AcceptTaskApplicationInput {
  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;
}
