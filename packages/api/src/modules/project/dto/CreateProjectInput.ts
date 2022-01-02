import { ProjectVisibility } from "@dewo/api/models/Project";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectInput {
  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => ProjectVisibility)
  public visibility?: ProjectVisibility;
}
