import { TaskStatusEnum } from "@dewo/api/models/Task";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class GetTasksInput {
  @Field(() => [GraphQLUUID], { nullable: true })
  public ids?: string[];

  @Field(() => [TaskStatusEnum], { nullable: true })
  public statuses?: TaskStatusEnum[];
}
