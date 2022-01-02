import { ProjectRole } from "@dewo/api/models/ProjectMember";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class UpdateProjectMemberInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => GraphQLUUID)
  public userId!: string;

  @Field(() => ProjectRole)
  public role!: ProjectRole;
}
