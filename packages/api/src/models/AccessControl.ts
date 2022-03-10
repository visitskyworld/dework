import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Audit } from "./Audit";

export enum AccessControlType {
  DISCORD_ROLE = "DISCORD_ROLE",
  // TOKEN = "TOKEN",
  OP = "OP",
}

export enum AccessControlOp {
  AND = "AND",
  OR = "OR",
}

export interface DiscordRoleAccessControlConfig {
  roleId: string;
  integrationId: string; // OrganizationIntegration
}

export interface OpAccessControlConfig {
  op: AccessControlOp;
}

export interface AccessControlConfigMap extends Record<AccessControlType, any> {
  [AccessControlType.DISCORD_ROLE]: DiscordRoleAccessControlConfig;
  [AccessControlType.OP]: OpAccessControlConfig;
}

registerEnumType(AccessControlType, { name: "AccessControlType" });
registerEnumType(AccessControlOp, {
  name: "AccessControlOp",
});

@Entity()
@ObjectType()
export class AccessControl<
  TType extends AccessControlType = AccessControlType
> extends Audit {
  @Field()
  @Column("enum", { enum: AccessControlType })
  public type!: TType;

  @Column("json")
  @Field(() => GraphQLJSONObject)
  public config!: AccessControlConfigMap[TType];

  @OneToMany(() => AccessControl, (x: AccessControl) => x.parent)
  @Field(() => [AccessControl])
  public children!: Promise<AccessControl[]>;

  @JoinColumn()
  @ManyToOne(() => AccessControl)
  @Field(() => AccessControl, { nullable: true })
  public parent?: Promise<AccessControl>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public parentId?: string;
}

export type DiscordRoleAccessControl =
  AccessControl<AccessControlType.DISCORD_ROLE>;
export type OpAccessControl = AccessControl<AccessControlType.OP>;
