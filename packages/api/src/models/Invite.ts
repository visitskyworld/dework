import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { OrganizationRole } from "./OrganizationMember";
import { PaymentToken } from "./PaymentToken";
import { Project } from "./Project";
import { ProjectRole } from "./ProjectMember";
import { User } from "./User";

@Entity()
@ObjectType()
export class Invite extends Audit {
  @JoinColumn()
  @ManyToOne(() => Organization, { nullable: true })
  @Field(() => Organization, { nullable: true })
  public organization?: Promise<Organization>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public organizationId?: string;

  @Column({ enum: OrganizationRole, nullable: true })
  @Field(() => OrganizationRole, { nullable: true })
  public organizationRole?: OrganizationRole;

  @JoinColumn()
  @ManyToOne(() => Project, { nullable: true })
  @Field(() => Project, { nullable: true })
  public project?: Promise<Project>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public projectId?: string;

  @Column({ enum: ProjectRole, nullable: true })
  @Field(() => ProjectRole, { nullable: true })
  public projectRole?: ProjectRole;

  @JoinColumn()
  @ManyToOne(() => PaymentToken)
  @Field(() => PaymentToken, { nullable: true })
  public token?: Promise<PaymentToken>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public tokenId?: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public inviter!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public inviterId!: string;
}
