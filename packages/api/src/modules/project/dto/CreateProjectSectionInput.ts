import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectSectionInput {
  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public organizationId!: string;
}
