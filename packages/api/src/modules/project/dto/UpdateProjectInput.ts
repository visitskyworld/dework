import { ProjectOptions } from "@dewo/api/models/Project";
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

  @Field(() => ProjectOptions, { nullable: true })
  public options?: ProjectOptions;

  @Field({ nullable: true })
  public deletedAt?: Date;
}
