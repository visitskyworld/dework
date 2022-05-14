import {
  TaskViewFilter,
  TaskViewGroupBy,
  TaskViewField,
  TaskViewSortBy,
  TaskViewType,
} from "@dewo/api/models/TaskView";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskViewInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field(() => TaskViewType, { nullable: true })
  public type?: TaskViewType;

  @Field(() => TaskViewGroupBy, { nullable: true })
  public groupBy?: TaskViewGroupBy;

  @Field(() => [TaskViewFilter], { nullable: true })
  public filters?: TaskViewFilter[];

  @Field(() => [TaskViewSortBy], { nullable: true })
  public sortBys?: TaskViewSortBy[];

  @Field(() => [TaskViewField], { nullable: true })
  public fields?: TaskViewField[];

  @Field({ nullable: true })
  public deletedAt?: Date;
}
