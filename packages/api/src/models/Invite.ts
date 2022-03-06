import { Field, ObjectType } from "@nestjs/graphql";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { OrganizationRole } from "./OrganizationMember";
import { Project } from "./Project";
import { ProjectRole } from "./ProjectMember";
import { User } from "./User";
import encoder from "uuid-base62";

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

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    this.slug = encoder.encode(this.id);
  }

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
  @ManyToOne(() => User)
  @Field(() => User)
  public inviter!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public inviterId!: string;
}
