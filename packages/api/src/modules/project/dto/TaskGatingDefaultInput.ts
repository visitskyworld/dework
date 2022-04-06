import { TaskGatingType } from "@dewo/api/models/enums/TaskGatingType";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class TaskGatingDefaultInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => TaskGatingType, { nullable: true })
  public type?: TaskGatingType;

  @Field(() => [GraphQLUUID], { nullable: true })
  public roleIds?: string[];
}
