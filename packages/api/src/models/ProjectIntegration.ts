import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Project } from "./Project";
import { User } from "./User";

export enum ProjectIntegrationSource {
  discord = "discord",
  github = "github",
}

export enum DiscordProjectIntegrationFeature {
  POST_CREATED_TASKS = "POST_CREATED_TASKS",
}

export enum GithubProjectIntegrationFeature {
  ADD_PR_TO_TASK = "ADD_PR_TO_TASK",
}

export interface DiscordProjectIntegrationConfig {
  guildId: string;
  channelId: string;
  features: DiscordProjectIntegrationFeature[];
}

export interface GithubProjectIntegrationConfig {
  installationId: string;
  features: GithubProjectIntegrationFeature[];
}

export interface ProjectIntegrationConfigMap
  extends Record<ProjectIntegrationSource, any> {
  [ProjectIntegrationSource.discord]: DiscordProjectIntegrationConfig;
  [ProjectIntegrationSource.github]: GithubProjectIntegrationConfig;
}

registerEnumType(ProjectIntegrationSource, {
  name: "ProjectIntegrationSource",
});
registerEnumType(DiscordProjectIntegrationFeature, {
  name: "DiscordProjectIntegrationFeature",
});
registerEnumType(GithubProjectIntegrationFeature, {
  name: "GithubProjectIntegrationFeature",
});

@Entity()
@ObjectType()
export class ProjectIntegration<
  TSource extends ProjectIntegrationSource = ProjectIntegrationSource
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

  @Field()
  @Column("enum", { enum: ProjectIntegrationSource })
  public source!: TSource;

  @Column("json")
  @Field(() => GraphQLJSONObject)
  public config!: ProjectIntegrationConfigMap[TSource];
}
