import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Role } from "discord.js";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Audit } from "../Audit";
import { Project } from "../Project";
import { Task } from "../Task";

export enum RulePermission {
  MANAGE_ORGANIZATION = "MANAGE_ORGANIZATION",
  MANAGE_PROJECTS = "MANAGE_PROJECTS",
  MANAGE_TASKS = "MANAGE_TASKS",
  VIEW_PROJECTS = "VIEW_PROJECTS",
}

registerEnumType(RulePermission, { name: "RulePermission" });

@Entity()
@ObjectType()
export class Rule extends Audit {
  @JoinColumn()
  @ManyToOne(() => Role)
  @Field(() => Role)
  public role!: Promise<Role>;
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
}
