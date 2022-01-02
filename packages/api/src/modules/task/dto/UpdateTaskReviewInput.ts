import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateTaskReviewInput {
  @Field({ nullable: true })
  public message?: string;

  @Field({ nullable: true })
  public rating?: number;

  @Field(() => GraphQLUUID, { nullable: true })
  public reviewerId?: string;
}
