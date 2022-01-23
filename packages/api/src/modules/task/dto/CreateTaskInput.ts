import { TaskOptions, TaskStatus } from "@dewo/api/models/Task";
import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateTaskRewardInput } from "./UpdateTaskRewardInput";

@InputType()
export class CreateTaskInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public description?: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public parentTaskId?: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public assigneeIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public ownerId?: string;

  @Field(() => Int, { nullable: true })
  public storyPoints?: number;

  @Field(() => TaskStatus)
  public status!: TaskStatus;

  @Field(() => UpdateTaskRewardInput, { nullable: true })
  public reward?: UpdateTaskRewardInput;

  @Field({ nullable: true })
  public dueDate?: Date;

  @Field(() => TaskOptions, { nullable: true })
  public options?: TaskOptions;
}
