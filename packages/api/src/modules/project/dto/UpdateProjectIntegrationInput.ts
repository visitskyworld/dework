import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateProjectIntegrationInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
