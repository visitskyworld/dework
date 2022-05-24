import { Field, ObjectType } from "@nestjs/graphql";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { Project } from "./Project";
import { User } from "./User";
import encoder from "uuid-base62";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { Task } from "./Task";

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

  @JoinColumn()
  @ManyToOne(() => Project, { nullable: true })
  @Field(() => Project, { nullable: true })
  public project?: Promise<Project>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public projectId?: string;

  @JoinColumn()
  @ManyToOne(() => Task, { nullable: true })
  @Field(() => Task, { nullable: true })
  public task?: Promise<Task>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public taskId?: string;

  @Column({ type: "enum", enum: RulePermission })
  @Field(() => RulePermission)
  public permission!: RulePermission;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public inviter!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public inviterId!: string;

  @Field()
  public slug!: string;

  @AfterLoad()
  getSlug() {
    this.slug = encoder.encode(this.id);
  }
}
