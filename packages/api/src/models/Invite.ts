import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { OrganizationRole } from "./OrganizationMember";
import { User } from "./User";

@Entity()
@ObjectType()
export class Invite extends Audit {
  @JoinColumn()
  @ManyToOne(() => Organization)
  @Field(() => Organization)
  public organization!: Promise<Organization>;
  @Column({ type: "uuid" })
  @Field()
  public organizationId!: string;

  @Column({ enum: OrganizationRole, nullable: true })
  @Field(() => OrganizationRole, { nullable: true })
  public role?: OrganizationRole;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public inviter!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public inviterId!: string;
}
