import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "./Audit";
import { Organization } from "./Organization";
import { User } from "./User";

@Entity()
@ObjectType()
export class Invite extends Audit {
  @JoinColumn()
  @ManyToOne(() => Organization, { nullable: true })
  @Field(() => Organization, { nullable: true })
  public organization!: Promise<Organization>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public organizationId!: string;

  // @JoinColumn()
  // @ManyToOne(() => Project, { nullable: true })
  // @Field(() => Project, { nullable: true })
  // public project?: Promise<Project>;
  // @Column({ type: "uuid", nullable: true })
  // @Field({ nullable: true })
  // public projectId!: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  public inviter!: Promise<User>;
  @Column({ type: "uuid" })
  @Field()
  public inviterId!: string;
}
