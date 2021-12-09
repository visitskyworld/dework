import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { User } from "./User";

export enum OrganizationRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

registerEnumType(OrganizationRole, { name: "OrganizationRole" });

@ObjectType()
@Entity()
export class OrganizationMember extends Audit {
  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public user!: Promise<User>;
  @PrimaryColumn({ type: "uuid" })
  @Field()
  public userId!: string;

  @Column({ enum: OrganizationRole })
  @Field(() => OrganizationRole)
  public role!: OrganizationRole;
}
