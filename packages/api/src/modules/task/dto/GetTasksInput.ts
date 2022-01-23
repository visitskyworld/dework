import { TaskStatus } from "@dewo/api/models/Task";
import { Field, InputType, Int } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class GetTasksInput {
  @Field(() => [GraphQLUUID], { nullable: true })
  public ids?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public assigneeId?: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public projectIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public organizationIds?: string[];

  @Field(() => [TaskStatus], { nullable: true })
  public statuses?: TaskStatus[];

  @Field({ nullable: true })
  public rewardNotNull?: boolean;

  // TODO(fant): how to prevent this from being very high?
  @Field(() => Int, { nullable: true, defaultValue: 1000 })
  public limit?: number;
}
