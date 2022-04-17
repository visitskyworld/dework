import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { ProjectRole } from "./enums/ProjectRole";
import { OrganizationIntegration } from "./OrganizationIntegration";
import { Project } from "./Project";
import { User } from "./User";

export enum ProjectIntegrationType {
  DISCORD = "DISCORD",
  DISCORD_ROLE_GATE = "DISCORD_ROLE_GATE",
  GITHUB = "GITHUB",
}

export enum GithubProjectIntegrationFeature {
  SHOW_BRANCHES = "SHOW_BRANCHES",
  SHOW_PULL_REQUESTS = "SHOW_PULL_REQUESTS",
  CREATE_ISSUES_FROM_TASKS = "CREATE_ISSUES_FROM_TASKS",
}

export enum DiscordProjectIntegrationFeature {
  POST_TASK_UPDATES_TO_CHANNEL = "POST_TASK_UPDATES_TO_CHANNEL",
  POST_TASK_UPDATES_TO_THREAD = "POST_TASK_UPDATES_TO_THREAD",
  POST_TASK_UPDATES_TO_THREAD_PER_TASK = "POST_TASK_UPDATES_TO_THREAD_PER_TASK",
  POST_NEW_TASKS_TO_CHANNEL = "POST_NEW_TASKS_TO_CHANNEL",
  POST_STATUS_BOARD_MESSAGE = "POST_STATUS_BOARD_MESSAGE",
}

export interface DiscordProjectIntegrationConfig {
  channelId: string;
  threadId?: string;
  messageId?: string;
  name: string;
  features: DiscordProjectIntegrationFeature[];
}

export interface DiscordRoleGateProjectIntegrationConfig {
  projectRole: ProjectRole;
  discordRoleIds: string[];
}

export interface GithubProjectIntegrationConfig {
  organization: string;
  repo: string;
  features: GithubProjectIntegrationFeature[];
}

export interface ProjectIntegrationConfigMap
  extends Record<ProjectIntegrationType, any> {
  [ProjectIntegrationType.DISCORD]: DiscordProjectIntegrationConfig;
  [ProjectIntegrationType.DISCORD_ROLE_GATE]: DiscordRoleGateProjectIntegrationConfig;
  [ProjectIntegrationType.GITHUB]: GithubProjectIntegrationConfig;
}

registerEnumType(ProjectIntegrationType, {
  name: "ProjectIntegrationType",
});
registerEnumType(GithubProjectIntegrationFeature, {
  name: "GithubProjectIntegrationFeature",
});
registerEnumType(DiscordProjectIntegrationFeature, {
  name: "DiscordProjectIntegrationFeature",
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
