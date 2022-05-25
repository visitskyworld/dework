import { Language } from "@dewo/api/models/enums/Language";
import { TaskPriority, TaskStatus } from "@dewo/api/models/Task";
import { TaskViewSortBy } from "@dewo/api/models/TaskView";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class DateRangeFilter {
  @Field({ nullable: true })
  public lt?: Date;

  @Field({ nullable: true })
  public lte?: Date;

  @Field({ nullable: true })
  public gt?: Date;

  @Field({ nullable: true })
  public gte?: Date;
}

@InputType()
export class CountTasksInput {
  @Field({ nullable: true })
  public public?: boolean;

  @Field({ nullable: true })
  public name?: string;

  @Field(() => [Language], { nullable: true })
  public languages?: Language[];

  @Field(() => [TaskStatus], { nullable: true })
  public statuses?: TaskStatus[];

  @Field(() => [TaskPriority], { nullable: true })
  public priorities?: TaskPriority[];

  @Field({ nullable: true })
  public hasReward?: boolean;

  @Field(() => [GraphQLUUID], { nullable: true })
  public skillIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public roleIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public assigneeIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public ownerIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public applicantIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: "itemsAndList" })
  public projectIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public parentTaskId?: null;

  @Field(() => [GraphQLUUID], { nullable: true })
  public organizationIds?: string[];

  @Field({ nullable: true })
  public featured?: boolean;

  @Field(() => DateRangeFilter, { nullable: true })
  public doneAt?: DateRangeFilter;
}

@InputType()
export class SearchTasksInput extends CountTasksInput {
  @Field()
  public sortBy!: TaskViewSortBy;
}
