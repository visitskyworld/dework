import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskSubmissionInput {
  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field()
  public content!: string;
}
