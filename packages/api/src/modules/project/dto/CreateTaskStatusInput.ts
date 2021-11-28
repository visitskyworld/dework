import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskStatusInput {
  @Field()
  public label!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;
}
