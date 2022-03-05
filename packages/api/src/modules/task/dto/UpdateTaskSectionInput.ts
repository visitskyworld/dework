import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskSectionInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public sortKey?: string;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
