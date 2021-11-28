import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskInput {
  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;
}
