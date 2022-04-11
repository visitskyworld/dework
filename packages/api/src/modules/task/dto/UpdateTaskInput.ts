import { TaskStatus } from "@dewo/api/models/Task";
import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { UpdateTaskRewardInput } from "./UpdateTaskRewardInput";
import { UpdateTaskReviewInput } from "./UpdateTaskReviewInput";
import { TaskGatingType } from "@dewo/api/models/enums/TaskGatingType";

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

  @Field(() => GraphQLUUID, { nullable: true })
  public sectionId?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public projectId?: string;

  @Field({ nullable: true })
  public sortKey?: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public assigneeIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public ownerIds?: string[];

  @Field(() => Int, { nullable: true })
  public storyPoints?: number;

  @Field(() => TaskStatus, { nullable: true })
  public status?: TaskStatus;

  @Field(() => TaskGatingType, { nullable: true })
  public gating?: TaskGatingType;

  @Field(() => UpdateTaskRewardInput, { nullable: true })
  public reward?: UpdateTaskRewardInput;

  @Field(() => UpdateTaskReviewInput, { nullable: true })
  public review?: UpdateTaskReviewInput;

  @Field({ nullable: true })
  public dueDate?: Date;
}
