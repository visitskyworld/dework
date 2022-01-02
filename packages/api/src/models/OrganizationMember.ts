import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { User } from "./User";

export enum OrganizationRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  FOLLOWER = "FOLLOWER",
}

registerEnumType(OrganizationRole, { name: "OrganizationRole" });

@ObjectType()
@Entity()
@Index("IDX_unique_user_organization", ["userId", "organizationId"], {
  unique: true,
})
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
