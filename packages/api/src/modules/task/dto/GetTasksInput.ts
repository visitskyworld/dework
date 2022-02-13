import { TaskStatus } from "@dewo/api/models/Task";
import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class TaskFilterInput {
  @Field({ nullable: true })
  public doneAtAfter?: Date;
  @Field({ nullable: true })
  public doneAtBefore?: Date;

  @Field(() => [TaskStatus], { nullable: true })
  public statuses?: TaskStatus[];

  @Field(() => Int, { nullable: true, defaultValue: 100 })
  public limit?: number;
}

@InputType()
export class GetTasksInput extends TaskFilterInput {
  @Field(() => [GraphQLUUID], { nullable: true })
  public ids?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public assigneeId?: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public projectIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public organizationIds?: string[];

  @Field({ nullable: true })
  public rewardNotNull?: boolean;
}
