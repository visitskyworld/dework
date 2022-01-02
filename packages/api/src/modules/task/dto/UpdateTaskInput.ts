import { TaskStatusEnum } from "@dewo/api/models/Task";
import { Field, InputType } from "@nestjs/graphql";
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

  @Field({ nullable: true })
  public sortKey?: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public assigneeIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public ownerId?: string;

  @Field(() => TaskStatusEnum, { nullable: true })
  public status?: TaskStatusEnum;

  @Field(() => UpdateTaskRewardInput, { nullable: true })
  public reward?: UpdateTaskRewardInput;

  @Field(() => UpdateTaskReviewInput, { nullable: true })
  public review?: UpdateTaskReviewInput;
}
