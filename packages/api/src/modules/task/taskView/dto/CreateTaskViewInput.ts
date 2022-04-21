import {
  TaskViewFilter,
  TaskViewGroupBy,
  TaskViewSortBy,
  TaskViewType,
} from "@dewo/api/models/TaskView";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskViewInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field()
  public name!: string;

  @Field(() => TaskViewType)
  public type!: TaskViewType;

  @Field(() => TaskViewGroupBy, { nullable: true })
  public groupBy?: TaskViewGroupBy;

  @Field(() => [TaskViewFilter])
  public filters!: TaskViewFilter[];

  @Field(() => [TaskViewSortBy])
  public sortBys!: TaskViewSortBy[];
}
