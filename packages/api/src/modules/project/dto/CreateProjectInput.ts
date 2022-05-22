import { ProjectOptions } from "@dewo/api/models/Project";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class CreateProjectInput {
  @Field()
  public name!: string;

  @Field(() => GraphQLUUID)
  public organizationId!: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public workspaceId?: string;

  @Field(() => ProjectOptions, { nullable: true })
  public options?: ProjectOptions;
}
