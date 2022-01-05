import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class TaskReactionInput {
  @Field()
  public reaction!: string;

  @Field(() => GraphQLUUID)
  public taskId!: string;
}
