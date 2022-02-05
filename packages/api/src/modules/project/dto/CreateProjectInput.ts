import { ProjectOptions, ProjectVisibility } from "@dewo/api/models/Project";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectInput {
  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public sectionId?: string;

  @Field(() => ProjectVisibility, { nullable: true })
  public visibility?: ProjectVisibility;

  @Field(() => ProjectOptions, { nullable: true })
  public options?: ProjectOptions;
}
