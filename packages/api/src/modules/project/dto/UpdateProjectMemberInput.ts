import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
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
