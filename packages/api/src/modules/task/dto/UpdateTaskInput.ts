import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public description?: string;

  @Field(() => [String], { nullable: true })
  public tagIds?: string[];

  @Field(() => GraphQLUUID, { nullable: true })
  public statusId?: string;
}
