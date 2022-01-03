import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { OrganizationIntegration } from "./OrganizationIntegration";
import { Project } from "./Project";
import { User } from "./User";

export enum ProjectIntegrationType {
  DISCORD = "DISCORD",
  GITHUB = "GITHUB",
}

export enum GithubProjectIntegrationFeature {
  SHOW_BRANCHES = "SHOW_BRANCHES",
  SHOW_PULL_REQUESTS = "SHOW_PULL_REQUESTS",
  // update status on PR up, PR closed, PR merged
}

export interface DiscordProjectIntegrationConfig {
  channelId: string;
  channelName: string;
}

export interface GithubProjectIntegrationConfig {
  organization: string;
  repo: string;
  features: GithubProjectIntegrationFeature[];
}

export interface ProjectIntegrationConfigMap
  extends Record<ProjectIntegrationType, any> {
  [ProjectIntegrationType.DISCORD]: DiscordProjectIntegrationConfig;
  [ProjectIntegrationType.GITHUB]: GithubProjectIntegrationConfig;
}

registerEnumType(ProjectIntegrationType, {
  name: "ProjectIntegrationType",
});
registerEnumType(GithubProjectIntegrationFeature, {
  name: "GithubProjectIntegrationFeature",
});

@Entity()
@ObjectType()
export class ProjectIntegration<
  TType extends ProjectIntegrationType = ProjectIntegrationType
> extends Audit {
  @JoinColumn()
  @ManyToOne(() => Project)
  @Field(() => Project)
  public project!: Promise<Project>;
  @Column({ type: "uuid" })
  @Field()
  public projectId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public creator!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public creatorId!: string;

  @JoinColumn()
  @ManyToOne(() => OrganizationIntegration)
  @Field(() => OrganizationIntegration, { nullable: true })
  public organizationIntegration?: Promise<OrganizationIntegration>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public organizationIntegrationId?: string;

  @Field()
  @Column("enum", { enum: ProjectIntegrationType })
  public type!: TType;

  @Column("json")
  @Field(() => GraphQLJSONObject)
  public config!: ProjectIntegrationConfigMap[TType];

  @Column({ nullable: true })
  @Field({ nullable: true })
  public deletedAt?: Date;
}
