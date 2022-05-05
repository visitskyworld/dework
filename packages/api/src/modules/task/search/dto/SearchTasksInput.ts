import { TaskPriority, TaskStatus } from "@dewo/api/models/Task";
import { TaskViewSortBy } from "@dewo/api/models/TaskView";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class SearchTasksInput {
  // @Field({ nullable: true })
  // public doneAtAfter?: Date;
  // @Field({ nullable: true })
  // public doneAtBefore?: Date;

  @Field(() => [TaskStatus], { nullable: true })
  public statuses?: TaskStatus[];

  @Field(() => [TaskPriority], { nullable: true })
  public priorities?: TaskPriority[];

  @Field({ nullable: true })
  public hasReward?: boolean;

  @Field(() => [GraphQLUUID], { nullable: true })
  public skillIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public assigneeIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public ownerIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public projectIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public parentTaskId?: null;

  @Field(() => GraphQLUUID, { nullable: true })
  public organizationId?: null;

  @Field()
  public sortBy!: TaskViewSortBy;
}