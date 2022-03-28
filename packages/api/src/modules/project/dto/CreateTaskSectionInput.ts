import { TaskStatus } from "@dewo/api/models/Task";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskSectionInput {
  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => TaskStatus)
  public status!: TaskStatus;
}
