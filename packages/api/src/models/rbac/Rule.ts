import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "../Audit";
import { RulePermission } from "../enums/RulePermission";
import { FundingSession } from "../funding/FundingSession";
import { Project } from "../Project";
import { Task } from "../Task";
import { Role } from "./Role";

@Entity()
@ObjectType()
export class Rule extends Audit {
  @JoinColumn()
  @ManyToOne(() => Role, { onDelete: "CASCADE" })
  @Field(() => Role)
  public role!: Promise<Role>;
  // inserting role with rules doesn't work when @Column is set here
  @Column({ type: "uuid" })
  @Field()
  public roleId!: string;

  @Column("enum", { enum: RulePermission })
  @Field(() => RulePermission)
  public permission!: RulePermission;

  @Column({ default: false })
  @Field()
  public inverted!: boolean;

  @JoinColumn()
  @ManyToOne(() => Task, { nullable: true })
  @Field(() => Task, { nullable: true })
  public task?: Promise<Task>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public taskId?: string;

  @JoinColumn()
  @ManyToOne(() => Project, { nullable: true })
  @Field(() => Project, { nullable: true })
  public project?: Promise<Project>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public projectId?: string;

  @JoinColumn()
  @ManyToOne(() => FundingSession, { nullable: true })
  @Field(() => FundingSession, { nullable: true })
  public fundingSession?: Promise<FundingSession>;
  @Column({ type: "uuid", nullable: true })
  @Field({ nullable: true })
  public fundingSessionId?: string;
}
