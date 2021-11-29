import { TaskStatusEnum } from "@dewo/api/models/Task";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public description?: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => [GraphQLUUID], { nullable: true })
  public tagIds?: string[];

  @Field(() => [GraphQLUUID], { nullable: true })
  public assigneeIds?: string[];

  @Field(() => TaskStatusEnum)
  public status!: TaskStatusEnum;
}
