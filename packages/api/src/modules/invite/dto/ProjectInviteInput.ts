import { ProjectRole } from "@dewo/api/models/ProjectMember";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";

@InputType()
export class ProjectInviteInput {
  @Field(() => GraphQLUUID)
  public projectId!: string;

  @Field(() => ProjectRole)
  public role!: ProjectRole;

  @Field(() => GraphQLUUID, { nullable: true })
  public tokenId?: string;
}
