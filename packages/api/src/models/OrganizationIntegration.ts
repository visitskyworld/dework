import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { ProjectIntegration } from "./ProjectIntegration";
import { User } from "./User";

export enum OrganizationIntegrationType {
  DISCORD = "DISCORD",
  GITHUB = "GITHUB",
}

export interface DiscordOrganizationIntegrationConfig {
  guildId: string;
  permissions: string;
  useTempDiscordBot?: boolean;
  useTempDiscordBot2?: boolean;
}

export interface GithubOrganizationIntegrationConfig {
  installationId: number;
}

export interface OrganizationIntegrationConfigMap
  extends Record<OrganizationIntegrationType, any> {
  [OrganizationIntegrationType.DISCORD]: DiscordOrganizationIntegrationConfig;
  [OrganizationIntegrationType.GITHUB]: GithubOrganizationIntegrationConfig;
}

registerEnumType(OrganizationIntegrationType, {
  name: "OrganizationIntegrationType",
});

@Entity()
@ObjectType()
@Unique(["type", "organizationId"])
export class OrganizationIntegration<
  TType extends OrganizationIntegrationType = OrganizationIntegrationType
> extends Audit {
  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public creator!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public creatorId!: string;

  @Field(() => OrganizationIntegrationType)
  @Column("enum", { enum: OrganizationIntegrationType })
  public type!: TType;

  @Column("json")
  @Field(() => GraphQLJSONObject)
  public config!: OrganizationIntegrationConfigMap[TType];

  @OneToMany(
    () => ProjectIntegration,
    (x: ProjectIntegration) => x.organizationIntegration
  )
  @Field(() => [ProjectIntegration])
  public projectIntegrations!: Promise<ProjectIntegration[]>;
}
