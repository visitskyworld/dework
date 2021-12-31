import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { User } from "./User";

export enum OrganizationIntegrationType {
  DISCORD = "DISCORD",
  GITHUB = "GITHUB",
}

export interface DiscordOrganizationIntegrationConfig {
  guildId: string;
  permissions: string;
}

export interface GithubOrganizationIntegrationConfig {
  installationId: string;
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

  @Field()
  @Column("enum", { enum: OrganizationIntegrationType })
  public type!: TType;

  @Column("json")
  @Field(() => GraphQLJSONObject)
  public config!: OrganizationIntegrationConfigMap[TType];
}