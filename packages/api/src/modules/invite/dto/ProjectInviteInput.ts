import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class ProjectInviteInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => ProjectRole)
  public role!: ProjectRole;
}
