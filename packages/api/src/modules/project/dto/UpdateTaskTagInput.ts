import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskTagInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field({ nullable: true })
  public label?: string;

  @Field({ nullable: true })
  public color?: string;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
