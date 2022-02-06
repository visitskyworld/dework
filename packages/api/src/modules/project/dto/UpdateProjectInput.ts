import { ProjectOptions, ProjectVisibility } from "@dewo/api/models/Project";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateProjectInput {
  @Field(() => GraphQLUUID)
  public id!: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public description?: string;

  @Field(() => GraphQLUUID, { nullable: true })
  public sectionId?: string;

  @Field(() => ProjectVisibility, { nullable: true })
  public visibility?: ProjectVisibility;

  @Field(() => ProjectOptions, { nullable: true })
  public options?: ProjectOptions;

  @Field({ nullable: true })
  public deletedAt?: Date;

  @Field({ nullable: true })
  public sortKey?: string;
}
