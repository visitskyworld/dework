import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class DeleteTaskApplicationInput {
  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;
}
