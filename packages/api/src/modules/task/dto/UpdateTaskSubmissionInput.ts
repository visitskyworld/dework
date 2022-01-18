import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskSubmissionInput {
  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public approverId?: string;

  @Field({ nullable: true })
  public content?: string;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
