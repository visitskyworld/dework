import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateTaskApplicationInput {
  @Field(() => GraphQLUUID)
  public taskId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;

  @Field({ nullable: true })
  public message?: string;

  @Field()
  public startDate!: Date;

  @Field()
  public endDate!: Date;
}
