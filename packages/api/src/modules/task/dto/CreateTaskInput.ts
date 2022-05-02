import { TaskGatingType } from "@dewo/api/models/enums/TaskGatingType";
import { TaskPriority, TaskStatus } from "@dewo/api/models/Task";
import { Field, Float, InputType } from "@nestjs/graphql";
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

  @Field(() => [GraphQLUUID], { nullable: true })
  public ownerIds?: string[];

  @Field(() => Float, { nullable: true })
  public storyPoints?: number;

  @Field(() => TaskStatus)
  public status!: TaskStatus;

  @Field(() => TaskPriority, { nullable: true })
  public priority?: TaskPriority;

  @Field(() => TaskGatingType, { nullable: true })
  public gating?: TaskGatingType;

  @Field(() => UpdateTaskRewardInput, { nullable: true })
  public reward?: UpdateTaskRewardInput;

  @Field({ nullable: true })
  public dueDate?: Date;
}
