import { TaskOptions, TaskStatus } from "@dewo/api/models/Task";
import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateTaskRewardInput } from "./UpdateTaskRewardInput";
import { UpdateTaskReviewInput } from "./UpdateTaskReviewInput";

@InputType()
export class UpdateTaskInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public description?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public parentTaskId?: string;

  @Field({ nullable: true })
  public sortKey?: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public assigneeIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public ownerId?: string;

  @Field(() => Int, { nullable: true })
  public storyPoints?: number;

  @Field(() => TaskStatus, { nullable: true })
  public status?: TaskStatus;

  @Field(() => UpdateTaskRewardInput, { nullable: true })
  public reward?: UpdateTaskRewardInput;

  @Field(() => UpdateTaskReviewInput, { nullable: true })
  public review?: UpdateTaskReviewInput;

  @Field({ nullable: true })
  public dueDate?: Date;

  @Field(() => TaskOptions, { nullable: true })
  public options?: TaskOptions;
}
